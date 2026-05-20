import "dotenv/config";
import mongoose from "mongoose";
import Problem from "../src/models/Problem.js";

const SHEET_SLUG = "dsa-master-sheet";

// [minOrder, maxOrder, subtopicName]
const RANGES = {
  basics: [
    [1, 11, "I/O & Conditionals"],
    [12, 28, "Loops & Math"],
    [29, 43, "Patterns"],
    [44, 50, "Arrays"],
    [51, 55, "Strings"],
    [56, 64, "STL"],
    [65, 69, "Sorting"],
    [70, 99, "Math & Recursion"],
  ],
  arrays: [
    [1, 12, "Array Basics"],
    [13, 99, "Array Manipulation"],
  ],
  "prefix-sum": [
    [1, 5, "Resources"],
    [6, 14, "1D Prefix Sum"],
    [15, 27, "Prefix Sum + HashMap"],
    [28, 99, "Array Basics"],
  ],
  "two-pointer": [
    [1, 5, "Resources"],
    [6, 21, "String & Array"],
    [22, 99, "Sum Problems"],
  ],
  "sliding-window": [
    [1, 5, "Resources"],
    [6, 12, "Fixed Window"],
    [13, 24, "Variable Window"],
    [25, 99, "Advanced"],
  ],
  "binary-search": [
    [1, 5, "Resources"],
    [6, 15, "Classic Binary Search"],
    [16, 20, "Sorted Array Variants"],
    [21, 99, "2D & Matrix"],
  ],
  "binary-search-advanced": [
    [1, 4, "Resources"],
    [5, 14, "Binary Search on Answer"],
    [15, 19, "Partition Problems"],
    [20, 99, "Competitive"],
  ],
  "string-algorithms": [
    [1, 6, "Resources"],
    [7, 10, "Pattern Matching"],
    [11, 13, "KMP"],
    [14, 99, "Z Algorithm & Hashing"],
  ],
  trie: [
    [1, 4, "Resources"],
    [5, 9, "Basic Trie"],
    [10, 14, "Word Problems"],
    [15, 99, "XOR Trie"],
  ],
  // adv-stl: handled separately (garbage rows + non-contiguous orders)
  bit: [
    [1, 6, "Resources"],
    [7, 16, "Basics"],
    [17, 99, "Bitmask & XOR"],
  ],
  "linked-list": [
    [1, 6, "Resources"],
    [7, 16, "Basics"],
    [17, 24, "Manipulation"],
    [25, 99, "Advanced"],
  ],
  "recursion-backtracking": [
    [1, 3, "Resources"],
    [4, 13, "Recursion"],
    [14, 20, "Subsets"],
    [21, 25, "Permutations & Combinations"],
    [26, 99, "Backtracking"],
  ],
  "sweep-line": [
    [1, 4, "Resources"],
    [5, 99, "Problems"],
  ],
  trees: [
    [1, 10, "Traversals"],
    [11, 18, "Properties & Height"],
    [19, 22, "Path Problems"],
    [23, 29, "Views & Advanced"],
    [30, 37, "BST"],
    [38, 99, "Construction"],
  ],
  graph: [
    [1, 8, "Resources"],
    [9, 17, "BFS & DFS"],
    [18, 28, "Matrix BFS/DFS"],
    [29, 37, "Topological Sort"],
    [38, 46, "Shortest Path"],
    [47, 50, "MST"],
    [51, 99, "DSU"],
  ],
};

function subtopicForOrder(topicSlug, order) {
  const ranges = RANGES[topicSlug];
  if (!ranges) return "";
  for (const [min, max, name] of ranges) {
    if (order >= min && order <= max) return name;
  }
  return "";
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // 1. Fix adv-stl: delete garbage section-header rows imported as problems
  // Section headers were imported as garbage rows with link starting with "Link"
  const deleted = await Problem.deleteMany({
    sheetSlug: SHEET_SLUG,
    topicSlug: "adv-stl",
    problemLink: /^Link/,
  });
  console.log(`\nadv-stl: deleted ${deleted.deletedCount} garbage rows`);

  // 2. dp: use the pattern field already stored in DB
  const dpProblems = await Problem.find({
    sheetSlug: SHEET_SLUG, topicSlug: "dp", pattern: { $ne: "" },
  }).select("_id pattern");
  const dpOps = dpProblems.map((p) => ({
    updateOne: { filter: { _id: p._id }, update: { $set: { subtopic: p.pattern } } },
  }));
  if (dpOps.length) {
    const r = await Problem.bulkWrite(dpOps);
    console.log(`dp: ${r.modifiedCount} problems assigned subtopics from pattern`);
  }

  // 3. adv-stl: assign by order ranges (skipping the deleted rows)
  const ADV_STL_RANGES = [
    [1, 5, "Resources"],
    [7, 12, "Stack"],
    [14, 18, "Queue"],
    [20, 26, "Monotonic Stack"],
    [28, 99, "Heap"],
  ];
  const advStlProblems = await Problem.find({
    sheetSlug: SHEET_SLUG,
    topicSlug: "adv-stl",
  }).select("_id order");
  const advStlOps = advStlProblems.map((p) => {
    let subtopic = "";
    for (const [min, max, name] of ADV_STL_RANGES) {
      if (p.order >= min && p.order <= max) { subtopic = name; break; }
    }
    return { updateOne: { filter: { _id: p._id }, update: { $set: { subtopic } } } };
  });
  if (advStlOps.length) {
    const r = await Problem.bulkWrite(advStlOps);
    console.log(`adv-stl: ${r.modifiedCount} problems assigned subtopics`);
  }

  // 4. All other topics: assign by order ranges
  const remaining = Object.keys(RANGES).filter((t) => t !== "dp" && t !== "adv-stl");
  for (const topicSlug of remaining) {
    const problems = await Problem.find({
      sheetSlug: SHEET_SLUG,
      topicSlug,
    }).select("_id order");

    const ops = problems.map((p) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { subtopic: subtopicForOrder(topicSlug, p.order) } },
      },
    }));
    if (!ops.length) { console.log(`${topicSlug}: no problems found`); continue; }
    const r = await Problem.bulkWrite(ops);
    console.log(`${topicSlug}: ${r.modifiedCount} problems assigned subtopics`);
  }

  // 5. Update adv-stl topic totalProblems after deletion
  const advStlCount = await Problem.countDocuments({ sheetSlug: SHEET_SLUG, topicSlug: "adv-stl" });
  await mongoose.connection.collection("topics").updateOne(
    { sheetSlug: SHEET_SLUG, slug: "adv-stl" },
    { $set: { totalProblems: advStlCount } }
  );
  const grandTotal = await Problem.countDocuments({ sheetSlug: SHEET_SLUG });
  await mongoose.connection.collection("sheets").updateOne(
    { slug: SHEET_SLUG },
    { $set: { totalProblems: grandTotal } }
  );
  console.log(`\nTotal problems in sheet: ${grandTotal}`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
