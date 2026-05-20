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
const CSV_FILE = path.join(__dirname, "i-200-cleaned.csv");
const SHEET_SLUG = "i-200";

const SHEET_META = {
  title: "I-200",
  slug: SHEET_SLUG,
  description:
    "Top 200 essential interview problems — arrays, strings, graphs, DP, and more. The canonical list for FAANG prep.",
  isPremium: false,
  accentColor: "#f59e0b",
  accentFrom: "#f59e0b",
  accentTo: "#ef4444",
};

// Row-range based sections (1-indexed data rows, after CSV header)
const SECTIONS = [
  { slug: "arrays",         title: "Arrays",              from: 1,   to: 30,  order: 1 },
  { slug: "strings",        title: "Strings",             from: 31,  to: 50,  order: 2 },
  { slug: "sliding-window", title: "Sliding Window",      from: 51,  to: 65,  order: 3 },
  { slug: "two-pointer",    title: "Two Pointers",        from: 66,  to: 82,  order: 4 },
  { slug: "binary-search",  title: "Binary Search",       from: 83,  to: 102, order: 5 },
  { slug: "stack-queue",    title: "Stack & Queue",       from: 103, to: 116, order: 6 },
  { slug: "linked-list",    title: "Linked List",         from: 117, to: 131, order: 7 },
  { slug: "trees",          title: "Trees",               from: 132, to: 158, order: 8 },
  { slug: "graph",          title: "Graph",               from: 159, to: 179, order: 9 },
  { slug: "dp",             title: "Dynamic Programming", from: 180, to: 999, order: 10 },
];

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

function sectionForRow(rowNum) {
  return SECTIONS.find((s) => rowNum >= s.from && rowNum <= s.to) ?? null;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Migrate index: drop old 2-field unique index, let Mongoose create the new 3-field one
  try {
    await Problem.collection.dropIndex("topicSlug_1_problemLink_1");
    console.log("Dropped old unique index topicSlug_1_problemLink_1");
  } catch {
    // Already dropped or never existed
  }
  await Problem.syncIndexes();
  console.log("Indexes synced");

  // Clean slate for this sheet only
  await Problem.deleteMany({ sheetSlug: SHEET_SLUG });
  await Topic.deleteMany({ sheetSlug: SHEET_SLUG });
  await Sheet.deleteOne({ slug: SHEET_SLUG });
  console.log("Cleared existing i-200 data\n");

  const rows = await parseCsv(CSV_FILE);

  // Global dedup: each unique link imported once, assigned to the first section it falls in
  const seenLinks = new Set();
  const topicProblems = {}; // topicSlug → APIProblem[]
  const topicOrders = {};   // topicSlug → current order counter

  let rowNum = 0;
  for (const row of rows) {
    rowNum++;
    const rawTitle = (row.title || "").trim();
    const rawLink = (row.link || "").trim();
    if (!rawTitle || !rawLink || rawTitle === "title") continue;

    const link = normalizeLink(rawLink);
    if (seenLinks.has(link)) continue; // skip duplicate
    seenLinks.add(link);

    const section = sectionForRow(rowNum);
    if (!section) continue;

    const { slug: topicSlug } = section;
    topicOrders[topicSlug] = (topicOrders[topicSlug] ?? 0) + 1;
    const order = topicOrders[topicSlug];

    const title = rawTitle;
    const slug = (row.slug || "").trim() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const platform = (row.platform || "LeetCode").trim();
    const difficulty = normalizeDifficulty(row.difficulty);
    const rawTags = (row.tags || "").trim();
    const tags = rawTags ? rawTags.split(",").map((t) => t.trim()).filter(Boolean) : [];

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
          subtopic: "",
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (!topicProblems[topicSlug]) topicProblems[topicSlug] = [];
    topicProblems[topicSlug].push(title);
  }

  // Upsert topics
  for (const section of SECTIONS) {
    const count = topicOrders[section.slug] ?? 0;
    if (count === 0) continue;
    await Topic.findOneAndUpdate(
      { sheetSlug: SHEET_SLUG, slug: section.slug },
      {
        $set: {
          title: section.title,
          sheetSlug: SHEET_SLUG,
          slug: section.slug,
          order: section.order,
          totalProblems: count,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`  ${section.title}: ${count} problems`);
  }

  const grandTotal = await Problem.countDocuments({ sheetSlug: SHEET_SLUG });
  await Sheet.findOneAndUpdate(
    { slug: SHEET_SLUG },
    { $set: { ...SHEET_META, totalProblems: grandTotal } },
    { upsert: true, returnDocument: "after" }
  );

  console.log(`\nSheet "${SHEET_SLUG}" → ${grandTotal} total problems`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
