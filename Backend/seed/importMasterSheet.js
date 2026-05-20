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

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeDifficulty(val) {
  const v = (val || "").trim();
  if (v === "Easy" || v === "Medium" || v === "Hard") return v;
  return "";
}

// Fix UTF-8 Mojibake: bytes were read as Latin-1 and re-encoded as UTF-8
// Reverses the double-encoding by treating each char as a raw byte
function fixMojibake(str) {
  if (!str) return str;
  try {
    const bytes = [];
    for (const char of str) {
      const code = char.charCodeAt(0);
      if (code <= 255) {
        bytes.push(code);
      } else {
        // Already a real Unicode char above U+00FF — push its UTF-8 bytes
        bytes.push(...Buffer.from(char, "utf8"));
      }
    }
    const decoded = Buffer.from(bytes).toString("utf8");
    // Only use decoded version if it has fewer non-ASCII artifacts
    return decoded;
  } catch {
    return str;
  }
}

// Normalize problem links: strip trailing /description/, normalize trailing slash
function normalizeLink(link) {
  if (!link) return link;
  return link
    .trim()
    .replace(/\/description\/?$/, "/")
    .replace(/([^/])\/$/, "$1/"); // ensure single trailing slash
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

  // Drop existing data for a clean re-seed
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
    const topicTitle = slugToTitle(topicSlug);
    const filePath = path.join(CSV_DIR, file);

    console.log(`Processing: ${file} → topic: ${topicSlug}`);
    const rows = await parseCsv(filePath);

    let count = 0;
    let order = 0;
    for (const row of rows) {
      const rawTitle = (row.title || row.Title || "").trim();
      const rawLink = (row.link || row.Link || "").trim();

      // Skip blank or re-read header rows
      if (!rawTitle || !rawLink || rawTitle === "title") continue;

      const title = fixMojibake(rawTitle);
      const link = normalizeLink(rawLink);
      const slug = fixMojibake((row.slug || row.Slug || "").trim());
      const platform = (row.platform || row.Platform || "").trim() || "GeeksforGeeks";
      const difficulty = normalizeDifficulty(row.difficulty || row.Difficulty);
      const rawTags = fixMojibake((row.tags || row.Tags || "").trim());
      const tags = rawTags ? rawTags.split(",").map((t) => t.trim()).filter(Boolean) : [];

      order++;

      await Problem.findOneAndUpdate(
        { sheetSlug: SHEET_SLUG, topicSlug, problemLink: link },
        {
          $set: {
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
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
        description:
          "A comprehensive sheet covering all major DSA topics from basics to advanced.",
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
