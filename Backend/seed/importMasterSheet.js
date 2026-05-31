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
const CSV_DIR = path.join(__dirname, "master-sheet-csvs");
const SHEET_SLUG = "dsa-master-sheet";

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

const TOPIC_TITLES = {
  basics: "Basics",
  arrays: "Arrays",
  "prefix-sum": "Prefix Sum",
  "two-pointer": "Two Pointers",
  "sliding-window": "Sliding Window",
  "binary-search": "Binary Search",
  "binary-search-advanced": "Binary Search on Answer",
  "string-algorithms": "String Algorithms",
  "linked-list": "Linked List",
  "recursion-backtracking": "Recursion & Backtracking",
  "adv-stl": "Advanced STL",
  trees: "Trees",
  trie: "Trie",
  graph: "Graph",
  dp: "Dynamic Programming",
  bit: "Bit Manipulation",
  "sweep-line": "Sweep Line",
};

// Only accept URLs that point to actual problems (not articles/guides)
function isProblemUrl(url) {
  if (!url || !url.startsWith("http")) return false;
  return (
    url.includes("/problems/") ||
    url.includes("/problem/") ||
    url.includes("atcoder.jp/contests/") ||
    url.includes("cses.fi/problemset/task/") ||
    url.includes("codeforces.com/contest/") ||
    url.includes("codeforces.com/problemset/problem/") ||
    url.includes("leetcode.com/problems/")
  );
}

function normalizeDifficulty(val) {
  const v = (val || "").trim();
  if (v === "Easy" || v === "Medium" || v === "Hard") return v;
  if (v === "Beginner") return "Easy";
  if (v === "Intermediate") return "Medium";
  if (v === "Advanced") return "Hard";
  return "";
}

function normalizeLink(link) {
  if (!link) return link;
  return link
    .trim()
    .replace(/\/description\/?$/, "/")
    .replace(/([^/])\/$/, "$1/");
}

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

async function seedSheet() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Problem.deleteMany({ sheetSlug: SHEET_SLUG });
  await Topic.deleteMany({ sheetSlug: SHEET_SLUG });
  await Sheet.deleteOne({ slug: SHEET_SLUG });
  console.log("Cleared existing sheet data\n");

  const csvFiles = fs
    .readdirSync(CSV_DIR)
    .filter((f) => f.endsWith(".csv"))
    .sort();

  let grandTotal = 0;

  for (const file of csvFiles) {
    const topicSlug = path.basename(file, ".csv");
    const topicTitle = TOPIC_TITLES[topicSlug] || topicSlug
      .split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const filePath = path.join(CSV_DIR, file);

    console.log(`Processing: ${file} → topic: ${topicSlug}`);
    const rows = await parseCsv(filePath);

    const seenLinks = new Set();
    let count = 0;
    let order = 0;

    for (const row of rows) {
      // Use first column as title regardless of column name
      const vals = Object.values(row);
      const rawTitle = fixMojibake((vals[0] || "").trim());
      const rawLink  = (row.link || row.Link || vals[1] || "").trim();

      // Skip blank, header echo rows, and non-problem URLs
      if (!rawTitle || !rawLink) continue;
      if (!isProblemUrl(rawLink)) continue;

      const link = normalizeLink(rawLink);
      if (seenLinks.has(link)) continue;
      seenLinks.add(link);

      order++;

      const slug = fixMojibake((row.slug || row.Slug || "").trim()) ||
        rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const platform = (row.platform || row.Platform || vals[2] || "GeeksforGeeks").trim();
      const difficulty = normalizeDifficulty(row.difficulty || row.Difficulty || vals[3] || "");
      const rawTags = fixMojibake((row.tags || row.Tags || "").trim());
      const tags = rawTags ? rawTags.split(",").map((t) => t.trim()).filter(Boolean) : [];

      await Problem.findOneAndUpdate(
        { sheetSlug: SHEET_SLUG, topicSlug, problemLink: link },
        {
          $set: {
            title: rawTitle,
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
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      count++;
    }

    grandTotal += count;
    console.log(`  → ${count} problems`);

    await Topic.findOneAndUpdate(
      { sheetSlug: SHEET_SLUG, slug: topicSlug },
      {
        $set: {
          title: topicTitle,
          sheetSlug: SHEET_SLUG,
          slug: topicSlug,
          order: TOPIC_ORDER[topicSlug] ?? 99,
          totalProblems: count,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`  → topic upserted: ${topicTitle}`);
  }

  await Sheet.findOneAndUpdate(
    { slug: SHEET_SLUG },
    {
      $set: {
        title: "DSA Master Sheet",
        slug: SHEET_SLUG,
        description: "A comprehensive sheet covering all major DSA topics from basics to advanced.",
        isPremium: false,
        totalProblems: grandTotal,
        accentColor: "#22d3ee",
        accentFrom: "#22d3ee",
        accentTo: "#6366f1",
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  console.log(`\nSheet: ${SHEET_SLUG} → ${grandTotal} total problems`);
  await mongoose.disconnect();
  console.log("Done.");
}

seedSheet().catch((err) => {
  console.error(err);
  process.exit(1);
});
