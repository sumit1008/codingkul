import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
import csvParser from "csv-parser";
import mongoose from "mongoose";

import Sheet from "../src/models/Sheet.js";
import Topic from "../src/models/Topic.js";
import Problem from "../src/models/Problem.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_DIR = path.join(__dirname, "master-dsa-csvs");
const SHEET_SLUG = "dsa-master-sheet";

const TOPIC_TITLES = {
  "adv-stl": "Advanced STL",
  bit: "Bit Manipulation",
  dp: "Dynamic Programming",
  graph: "Graph",
  "linked-list": "Linked List",
  "recursion-backtracking": "Recursion & Backtracking",
  "sweep-line": "Sweep Line",
  trees: "Trees",
};

const TOPIC_ORDER = {
  "linked-list": 9,
  "recursion-backtracking": 10,
  "adv-stl": 11,
  trees: 12,
  graph: 14,
  dp: 15,
  bit: 16,
  "sweep-line": 17,
};

function fixMojibake(str) {
  if (!str) return str;
  try {
    const bytes = [];
    for (const char of str) {
      const code = char.charCodeAt(0);
      if (code <= 255) {
        bytes.push(code);
      } else {
        bytes.push(...Buffer.from(char, "utf8"));
      }
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

function normalizePlatform(val) {
  const v = (val || "").trim();
  if (v === "GFG") return "GeeksforGeeks";
  return v || "LeetCode";
}

function normalizeDifficulty(val) {
  const v = (val || "").trim();
  if (v === "Easy" || v === "Medium" || v === "Hard") return v;
  return "";
}

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

async function seedNewTopics() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const csvFiles = fs
    .readdirSync(CSV_DIR)
    .filter((f) => f.endsWith(".csv"))
    .sort();

  for (const file of csvFiles) {
    // topic slug from filename: cleaned_adv_stl.csv → adv-stl
    const baseName = path.basename(file, ".csv").replace(/^cleaned_/, "");
    const topicSlug = baseName.toLowerCase().replace(/_/g, "-");
    const topicTitle = TOPIC_TITLES[topicSlug] || topicSlug;
    const filePath = path.join(CSV_DIR, file);

    console.log(`\nProcessing: ${file} → topic: ${topicSlug}`);
    const rows = await parseCsv(filePath);

    // Track seen links within this topic to detect same-link duplicates
    const seenLinks = new Map(); // normalizedLink → titleSlug of first occurrence

    let order = 0;
    let upsertCount = 0;

    for (const row of rows) {
      const rawTitle = (row.title || row.Title || "").trim();
      const rawLink = (row.link || row.Link || "").trim();

      // Skip blank rows, header re-rows, and section label rows
      if (!rawTitle || !rawLink) continue;
      if (rawTitle === "title" || rawTitle === "Title") continue;
      if (rawTitle === "Problem" || rawTitle.startsWith("Problem (")) continue;

      const title = fixMojibake(rawTitle);
      let link = normalizeLink(rawLink);

      // Determine if this is an article or problem
      const rawResourceType = (row.resource_type || "").trim();
      const isArticle = rawResourceType === "Article" ||
        (!["Easy", "Medium", "Hard", ""].includes(rawResourceType) && rawResourceType !== "");

      // For adv_stl: resource_type column holds difficulty values on problem rows
      let difficulty = normalizeDifficulty(row.difficulty || row.Difficulty || "");
      if (!isArticle && ["Easy", "Medium", "Hard"].includes(rawResourceType)) {
        difficulty = rawResourceType;
      }

      const resourceType = isArticle ? "Article" : "Problem";
      const platform = normalizePlatform(row.platform || row.Platform || "");
      const priority = fixMojibake((row.priority || "").trim());
      const pattern = fixMojibake((row.pattern || "").trim());
      const subpattern = fixMojibake((row.subpattern || "").trim());

      // Handle duplicate links within same topic — append title-based anchor
      const baseLink = link;
      if (seenLinks.has(baseLink)) {
        const titleSlug = titleToSlug(title);
        link = `${baseLink}#${titleSlug}`;
      } else {
        seenLinks.set(baseLink, titleToSlug(title));
      }

      order++;
      const slug = titleToSlug(title);

      await Problem.findOneAndUpdate(
        { sheetSlug: SHEET_SLUG, topicSlug, problemLink: link },
        {
          $set: {
            title,
            slug,
            platform,
            difficulty,
            tags: [],
            sheetSlug: SHEET_SLUG,
            topicSlug,
            problemLink: link,
            order,
            xp: 50,
            isPremium: false,
            resourceType,
            pattern,
            subpattern,
            priority,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      upsertCount++;
    }

    // Use actual DB count for topic totalProblems
    const dbCount = await Problem.countDocuments({ sheetSlug: SHEET_SLUG, topicSlug });
    console.log(`  → ${upsertCount} rows processed, ${dbCount} total in DB for topic`);

    await Topic.findOneAndUpdate(
      { sheetSlug: SHEET_SLUG, slug: topicSlug },
      {
        $set: {
          title: topicTitle,
          sheetSlug: SHEET_SLUG,
          slug: topicSlug,
          order: TOPIC_ORDER[topicSlug] ?? 99,
          totalProblems: dbCount,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`  → topic upserted: ${topicTitle}`);
  }

  // Update sheet total
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

seedNewTopics().catch((err) => {
  console.error(err);
  process.exit(1);
});
