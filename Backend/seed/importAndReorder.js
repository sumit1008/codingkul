import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
import csvParser from "csv-parser";
import mongoose from "mongoose";

import Sheet from "../src/models/Sheet.js";
import Topic from "../src/models/Topic.js";
import Problem from "../src/models/Problem.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEET_SLUG = "dsa-master-sheet";

// Canonical topic order for the full sheet
const TOPIC_ORDER = {
  basics: 1,
  arrays: 2,
  "prefix-sum": 3,
  "two-pointer": 4,
  "sliding-window": 5,
  "binary-search": 6,
  "binary-search-advanced": 7,
  "string-algorithms": 8,
  "linked-list": 9,
  "recursion-backtracking": 10,
  "adv-stl": 11,
  trees: 12,
  trie: 13,
  graph: 14,
  dp: 15,
  bit: 16,
  "sweep-line": 17,
};

const NEW_TOPICS = [
  {
    slug: "string-algorithms",
    title: "String Algorithms",
    csvFile: path.join(__dirname, "master-sheet-csvs", "string-algorithms.csv"),
  },
  {
    slug: "trie",
    title: "Trie",
    csvFile: path.join(__dirname, "master-sheet-csvs", "trie.csv"),
  },
];

function fixMojibake(str) {
  if (!str) return str;
  try {
    const bytes = [];
    for (const char of str) {
      const code = char.charCodeAt(0);
      if (code <= 255) bytes.push(code);
      else bytes.push(...Buffer.from(char, "utf8"));
    }
    return Buffer.from(bytes).toString("utf8");
  } catch {
    return str;
  }
}

function normalizeLink(link) {
  if (!link) return link;
  return link
    .trim()
    .replace(/\/description\/?$/, "/")
    .replace(/([^/])\/$/, "$1/");
}

function normalizeDifficulty(val) {
  const v = (val || "").trim();
  if (v === "Easy" || v === "Medium" || v === "Hard") return v;
  return "";
}

function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function importNewTopics() {
  for (const { slug: topicSlug, title: topicTitle, csvFile } of NEW_TOPICS) {
    console.log(`\nImporting: ${topicTitle} (${topicSlug})`);
    const rows = await parseCsv(csvFile);

    const seenLinks = new Map();
    let order = 0;

    for (const row of rows) {
      const rawTitle = (row.title || "").trim();
      const rawLink = (row.link || "").trim();
      if (!rawTitle || !rawLink || rawTitle === "title") continue;

      const title = fixMojibake(rawTitle);
      let link = normalizeLink(rawLink);
      const slug = (row.slug || "").trim() ||
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const platform = (row.platform || "GeeksforGeeks").trim();
      const difficulty = normalizeDifficulty(row.difficulty);
      const rawTags = (row.tags || "").trim();
      const tags = rawTags ? rawTags.split(",").map((t) => t.trim()).filter(Boolean) : [];

      const baseLink = link;
      if (seenLinks.has(baseLink)) {
        link = `${baseLink}#${slug}`;
      } else {
        seenLinks.set(baseLink, slug);
      }

      order++;

      await Problem.findOneAndUpdate(
        { sheetSlug: SHEET_SLUG, topicSlug, problemLink: link },
        {
          $set: {
            title,
            slug,
            platform,
            difficulty,
            tags,
            sheetSlug: SHEET_SLUG,
            topicSlug,
            problemLink: link,
            order,
            xp: 50,
            isPremium: false,
            resourceType: "Problem",
            pattern: "",
            subpattern: "",
            priority: "",
          },
        },
        { upsert: true, returnDocument: "after" }
      );
    }

    const dbCount = await Problem.countDocuments({ sheetSlug: SHEET_SLUG, topicSlug });
    console.log(`  → ${order} rows processed, ${dbCount} in DB`);

    await Topic.findOneAndUpdate(
      { sheetSlug: SHEET_SLUG, slug: topicSlug },
      {
        $set: {
          title: topicTitle,
          sheetSlug: SHEET_SLUG,
          slug: topicSlug,
          order: TOPIC_ORDER[topicSlug],
          totalProblems: dbCount,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`  → topic upserted: ${topicTitle} (order ${TOPIC_ORDER[topicSlug]})`);
  }
}

async function reorderAllTopics() {
  console.log("\nReordering all topics...");
  const bulkOps = Object.entries(TOPIC_ORDER).map(([slug, order]) => ({
    updateOne: {
      filter: { sheetSlug: SHEET_SLUG, slug },
      update: { $set: { order } },
    },
  }));
  const result = await Topic.bulkWrite(bulkOps);
  console.log(`  → ${result.modifiedCount} topics updated`);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await importNewTopics();
  await reorderAllTopics();

  const grandTotal = await Problem.countDocuments({ sheetSlug: SHEET_SLUG });
  await Sheet.findOneAndUpdate(
    { slug: SHEET_SLUG },
    { $set: { totalProblems: grandTotal } },
    { returnDocument: "after" }
  );
  console.log(`\nSheet total: ${grandTotal} problems`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
