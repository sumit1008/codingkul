/**
 * seedBatches.js
 *
 * Idempotent seed script: creates Foundation, Accelerator, and Placement
 * batches with sample lectures, homework, schedules, and announcements.
 * Enrolls existing users into the correct batch based on their courseTier.
 *
 * Safe to re-run: all operations are upsert / $addToSet — nothing is
 * duplicated or overwritten on subsequent runs.
 *
 * Usage:
 *   npm run seed:batches
 *   node seed/seedBatches.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Batch from "../src/models/Batch.js";
import Lecture from "../src/models/Lecture.js";
import Homework from "../src/models/Homework.js";
import User from "../src/models/User.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function log(msg) { console.log(`  ${msg}`); }
function section(msg) { console.log(`\n── ${msg} ──`); }

// ── Batch definitions ─────────────────────────────────────────────────────────

const BATCH_DEFS = [
  // ─── FOUNDATION ────────────────────────────────────────────────────────────
  {
    slug:          "foundation-batch",
    title:         "Foundation Batch",
    requiredTier:  "FOUNDATION",
    description:   "Live batch for Foundation students. Covers arrays, strings, sorting, searching, and recursion over 6 months with weekly live classes and homework.",
    instructorName:"CodingKul Team",
    meetLink:      "https://meet.google.com/placeholder-foundation",
    bannerImage:   "",
    startDate:     daysFromNow(-60),
    endDate:       daysFromNow(120),
    isActive:      true,
    announcements: [
      {
        title:   "Welcome to Foundation Batch!",
        content: "Welcome everyone! This batch covers DSA fundamentals over 6 months. Please join the WhatsApp group, set up your LeetCode account, and bookmark the class schedule. First live class is this week — details in the schedule tab.",
        isPinned: true,
        createdAt: daysFromNow(-60),
      },
      {
        title:   "Weekly Contest This Sunday",
        content: "Participate in this Sunday's Codeforces Div. 3 contest. We will hold a full discussion class on Monday covering all problems. Drop your questions in the batch group beforehand.",
        isPinned: false,
        createdAt: daysFromNow(-2),
      },
    ],
    schedule: [
      {
        title:           "Live Class: Two Pointers & Sliding Window",
        liveAt:          daysFromNow(3),
        durationMinutes: 90,
        meetLink:        "https://meet.google.com/placeholder-foundation",
        isCompleted:     false,
      },
    ],
  },

  // ─── ACCELERATOR ───────────────────────────────────────────────────────────
  {
    slug:          "accelerator-batch",
    title:         "Accelerator Batch",
    requiredTier:  "ACCELERATOR",
    description:   "Intermediate live batch for Accelerator students. Covers advanced data structures, graph algorithms, and dynamic programming with ranked contests and mentorship.",
    instructorName:"CodingKul Team",
    meetLink:      "https://meet.google.com/placeholder-accelerator",
    bannerImage:   "",
    startDate:     daysFromNow(-45),
    endDate:       daysFromNow(135),
    isActive:      true,
    announcements: [
      {
        title:   "Welcome to Accelerator Batch!",
        content: "Welcome to the Accelerator batch! We will be covering Trees, Graphs, and Dynamic Programming in depth. Make sure your Codeforces account is linked on the platform for contest tracking.",
        isPinned: true,
        createdAt: daysFromNow(-45),
      },
      {
        title:   "Codeforces Round This Weekend",
        content: "Codeforces Div. 2 Round is scheduled this Saturday. Your performance will count toward the batch leaderboard. The top 3 solvers will be featured in Monday's discussion session.",
        isPinned: false,
        createdAt: daysFromNow(-1),
      },
    ],
    schedule: [
      {
        title:           "Live Class: Advanced DP Patterns",
        liveAt:          daysFromNow(4),
        durationMinutes: 100,
        meetLink:        "https://meet.google.com/placeholder-accelerator",
        isCompleted:     false,
      },
    ],
  },

  // ─── PLACEMENT ─────────────────────────────────────────────────────────────
  {
    slug:          "placement-batch",
    title:         "Placement Batch",
    requiredTier:  "PLACEMENT",
    description:   "Advanced live batch for Placement students. Covers hard-level DSA, core CS subjects (OS, DBMS, CN), SQL interview prep, mock interviews, and resume building.",
    instructorName:"CodingKul Team",
    meetLink:      "https://meet.google.com/placeholder-placement",
    bannerImage:   "",
    startDate:     daysFromNow(-30),
    endDate:       daysFromNow(150),
    isActive:      true,
    announcements: [
      {
        title:   "Welcome to Placement Batch!",
        content: "Welcome to the Placement batch — the most intensive program on the platform. Over the next 6 months we will cover hard DSA, all core CS subjects, SQL, mock interviews, and resume reviews. First mock interview slots open this week.",
        isPinned: true,
        createdAt: daysFromNow(-30),
      },
      {
        title:   "Resume Review Session — This Thursday",
        content: "Resume review sessions are scheduled this Thursday. Send your latest resume PDF to the batch group before Wednesday midnight. Sessions are 20 minutes each, slots are limited.",
        isPinned: false,
        createdAt: daysFromNow(-1),
      },
    ],
    schedule: [
      {
        title:           "Mock Interview Round 1",
        liveAt:          daysFromNow(2),
        durationMinutes: 60,
        meetLink:        "https://meet.google.com/placeholder-placement",
        isCompleted:     false,
      },
    ],
  },
];

// ── Lecture definitions ───────────────────────────────────────────────────────
// Slugs must be globally unique across all batches.
// YouTube IDs are placeholder demo IDs — replace with real recording IDs.

const LECTURE_DEFS = [
  // ─── Foundation ────────────────────────────────────────────────────────────
  {
    batchSlug:            "foundation-batch",
    slug:                 "fb-arrays-intro",
    title:                "Introduction to Arrays & Time Complexity",
    module:               "Module 1: Arrays & Strings",
    description:          "Arrays from scratch: memory model, indexing, traversal patterns, and Big-O complexity analysis for common operations.",
    youtubeVideoId:       "rZcuFfPOATg", // placeholder — replace with recording ID
    duration:             45,
    order:                1,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "foundation-batch",
    slug:                 "fb-two-pointers",
    title:                "Two Pointers & Sliding Window Techniques",
    module:               "Module 1: Arrays & Strings",
    description:          "Efficient linear-time patterns: two-pointer collision, same-direction, and fixed/variable sliding window. Solved examples: Two Sum, Minimum Window Substring.",
    youtubeVideoId:       "QXam5z4WPzM", // placeholder
    duration:             60,
    order:                2,
    isLiveClassRecording: true,
  },
  {
    batchSlug:            "foundation-batch",
    slug:                 "fb-sorting-algorithms",
    title:                "Sorting Algorithms In Depth",
    module:               "Module 2: Sorting & Searching",
    description:          "Comparison sorts — Bubble, Selection, Insertion, Merge, Quick. Analysis, in-place vs. out-of-place, stability, and when to use each.",
    youtubeVideoId:       "kPRA0W1kECg", // placeholder
    duration:             50,
    order:                3,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "foundation-batch",
    slug:                 "fb-binary-search",
    title:                "Binary Search & Its Variants",
    module:               "Module 2: Sorting & Searching",
    description:          "Classic binary search plus variants: search in rotated array, first/last occurrence, search in 2D matrix, and answer-binary-search problems.",
    youtubeVideoId:       "P3YID7pr450", // placeholder
    duration:             55,
    order:                4,
    isLiveClassRecording: false,
  },

  // ─── Accelerator ───────────────────────────────────────────────────────────
  {
    batchSlug:            "accelerator-batch",
    slug:                 "ab-trees-traversals",
    title:                "Binary Trees & All Traversals",
    module:               "Module 1: Trees & Graphs",
    description:          "Tree fundamentals: node structure, recursive and iterative inorder/preorder/postorder, level-order BFS, and tree height/diameter problems.",
    youtubeVideoId:       "oSWTXtMglKE", // placeholder
    duration:             65,
    order:                1,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "accelerator-batch",
    slug:                 "ab-bst-operations",
    title:                "BST Operations & AVL Trees",
    module:               "Module 1: Trees & Graphs",
    description:          "BST search, insert, delete, successor/predecessor. Intro to balanced BSTs (AVL rotations) and when to use TreeMap vs. HashMap.",
    youtubeVideoId:       "4r1uVWM_pvA", // placeholder
    duration:             70,
    order:                2,
    isLiveClassRecording: true,
  },
  {
    batchSlug:            "accelerator-batch",
    slug:                 "ab-graph-bfs-dfs",
    title:                "Graph Representation, BFS & DFS",
    module:               "Module 2: Graph Algorithms",
    description:          "Adjacency list vs. matrix, BFS shortest path in unweighted graphs, DFS cycle detection and connected components. Problems: Number of Islands, Clone Graph.",
    youtubeVideoId:       "tWVWeAqZ0WU", // placeholder
    duration:             75,
    order:                3,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "accelerator-batch",
    slug:                 "ab-dp-fundamentals",
    title:                "Dynamic Programming: Memoization to Tabulation",
    module:               "Module 3: Dynamic Programming",
    description:          "DP intuition: overlapping subproblems, optimal substructure. Top-down memoization → bottom-up tabulation. Classic problems: Fibonacci, Coin Change, Longest Common Subsequence.",
    youtubeVideoId:       "oBt53YbR9Kk", // placeholder
    duration:             80,
    order:                4,
    isLiveClassRecording: false,
  },

  // ─── Placement ─────────────────────────────────────────────────────────────
  {
    batchSlug:            "placement-batch",
    slug:                 "pb-hard-dp-greedy",
    title:                "Hard DP & Greedy Algorithms",
    module:               "Module 1: Advanced DSA",
    description:          "Advanced DP: interval DP, bitmask DP, digit DP. Greedy proofs and when greedy fails. Problems: Burst Balloons, Candy, Jump Game II.",
    youtubeVideoId:       "nqowUJzG-iM", // placeholder
    duration:             90,
    order:                1,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "placement-batch",
    slug:                 "pb-os-fundamentals",
    title:                "OS Fundamentals for Interviews",
    module:               "Module 2: Core CS Subjects",
    description:          "Processes vs. threads, CPU scheduling (FCFS, SJF, Round Robin, Priority), deadlock (conditions, prevention, detection), virtual memory and paging.",
    youtubeVideoId:       "vBURTt97EkA", // placeholder
    duration:             70,
    order:                2,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "placement-batch",
    slug:                 "pb-dbms-normalization",
    title:                "DBMS: Normalization & Transactions",
    module:               "Module 2: Core CS Subjects",
    description:          "1NF through BCNF normalization with examples. ACID properties, concurrency control (locking, MVCC), and transaction isolation levels.",
    youtubeVideoId:       "UrYLYV7WSHM", // placeholder
    duration:             65,
    order:                3,
    isLiveClassRecording: false,
  },
  {
    batchSlug:            "placement-batch",
    slug:                 "pb-advanced-sql",
    title:                "Advanced SQL Queries & Optimization",
    module:               "Module 3: SQL",
    description:          "Window functions (ROW_NUMBER, RANK, LEAD/LAG), CTEs, self-joins, subquery optimization, and EXPLAIN plans. Top 20 SQL interview patterns.",
    youtubeVideoId:       "m1KcNV-Zhmc", // placeholder
    duration:             75,
    order:                4,
    isLiveClassRecording: true,
  },
];

// ── Homework definitions ──────────────────────────────────────────────────────

const HOMEWORK_DEFS = [
  // ─── Foundation ────────────────────────────────────────────────────────────
  {
    batchSlug:   "foundation-batch",
    title:       "Arrays & Two Pointers — Warm-Up Set",
    description: "Core array and two-pointer problems to solidify Module 1 concepts. Attempt all three; the third is a bonus stretch problem.",
    dueDate:     daysFromNow(7),
    difficulty:  "Easy",
    xpReward:    100,
    isMandatory: false,
    problems: [
      { title: "Two Sum",                              platform: "LeetCode",   link: "https://leetcode.com/problems/two-sum/",                         tags: ["array", "hash-map"],   difficulty: "Easy"   },
      { title: "Best Time to Buy and Sell Stock",      platform: "LeetCode",   link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", tags: ["array", "greedy"],     difficulty: "Easy"   },
      { title: "Container With Most Water",            platform: "LeetCode",   link: "https://leetcode.com/problems/container-with-most-water/",       tags: ["array", "two-pointer"],difficulty: "Medium" },
    ],
  },
  {
    batchSlug:   "foundation-batch",
    title:       "Binary Search Practice Set",
    description: "Apply binary search and its variants from Module 2. All three problems are required. Hint: think about the invariant before writing code.",
    dueDate:     daysFromNow(14),
    difficulty:  "Medium",
    xpReward:    150,
    isMandatory: true,
    problems: [
      { title: "Binary Search",                           platform: "LeetCode", link: "https://leetcode.com/problems/binary-search/",                           tags: ["binary-search"],                     difficulty: "Easy"   },
      { title: "Search Insert Position",                  platform: "LeetCode", link: "https://leetcode.com/problems/search-insert-position/",                  tags: ["binary-search"],                     difficulty: "Easy"   },
      { title: "Find First and Last Position of Element", platform: "LeetCode", link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", tags: ["binary-search"], difficulty: "Medium" },
    ],
  },

  // ─── Accelerator ───────────────────────────────────────────────────────────
  {
    batchSlug:   "accelerator-batch",
    title:       "Tree Traversal & BST Problems",
    description: "Reinforce tree operations from Module 1. Focus on getting the recursive structure right before optimising.",
    dueDate:     daysFromNow(5),
    difficulty:  "Medium",
    xpReward:    150,
    isMandatory: false,
    problems: [
      { title: "Binary Tree Inorder Traversal",       platform: "LeetCode", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",        tags: ["tree", "dfs"],          difficulty: "Easy"   },
      { title: "Binary Tree Level Order Traversal",   platform: "LeetCode", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",    tags: ["tree", "bfs"],          difficulty: "Medium" },
      { title: "Validate Binary Search Tree",         platform: "LeetCode", link: "https://leetcode.com/problems/validate-binary-search-tree/",          tags: ["tree", "bst", "dfs"],   difficulty: "Medium" },
    ],
  },
  {
    batchSlug:   "accelerator-batch",
    title:       "Graph BFS/DFS Problem Set",
    description: "Core graph problems from Module 2. All three are required and are commonly asked in interviews at product companies.",
    dueDate:     daysFromNow(12),
    difficulty:  "Hard",
    xpReward:    200,
    isMandatory: true,
    problems: [
      { title: "Number of Islands",  platform: "LeetCode", link: "https://leetcode.com/problems/number-of-islands/",  tags: ["graph", "bfs", "dfs", "matrix"], difficulty: "Medium" },
      { title: "Clone Graph",        platform: "LeetCode", link: "https://leetcode.com/problems/clone-graph/",        tags: ["graph", "bfs", "hash-map"],      difficulty: "Medium" },
      { title: "Course Schedule",    platform: "LeetCode", link: "https://leetcode.com/problems/course-schedule/",    tags: ["graph", "topological-sort"],     difficulty: "Medium" },
    ],
  },

  // ─── Placement ─────────────────────────────────────────────────────────────
  {
    batchSlug:   "placement-batch",
    title:       "Hard DP Problem Set",
    description: "Three hard DP problems. These are placement-level — all three are required. Expected time: 3–4 hours combined.",
    dueDate:     daysFromNow(4),
    difficulty:  "Hard",
    xpReward:    250,
    isMandatory: true,
    problems: [
      { title: "Edit Distance",              platform: "LeetCode", link: "https://leetcode.com/problems/edit-distance/",               tags: ["dp", "string"],           difficulty: "Medium" },
      { title: "Burst Balloons",             platform: "LeetCode", link: "https://leetcode.com/problems/burst-balloons/",              tags: ["dp", "interval-dp"],      difficulty: "Hard"   },
      { title: "Regular Expression Matching",platform: "LeetCode", link: "https://leetcode.com/problems/regular-expression-matching/", tags: ["dp", "string", "recursion"],difficulty: "Hard" },
    ],
  },
  {
    batchSlug:   "placement-batch",
    title:       "SQL Interview Questions Set",
    description: "Top SQL interview patterns. Problems map directly to questions asked at Wipro, TCS, Infosys, and product-based companies.",
    dueDate:     daysFromNow(10),
    difficulty:  "Medium",
    xpReward:    200,
    isMandatory: true,
    problems: [
      { title: "Employees Earning More Than Their Managers", platform: "LeetCode", link: "https://leetcode.com/problems/employees-earning-more-than-their-managers/", tags: ["sql", "self-join"],       difficulty: "Easy"   },
      { title: "Rank Scores",                               platform: "LeetCode", link: "https://leetcode.com/problems/rank-scores/",                                tags: ["sql", "window-function"], difficulty: "Medium" },
      { title: "Nth Highest Salary",                        platform: "LeetCode", link: "https://leetcode.com/problems/nth-highest-salary/",                         tags: ["sql", "subquery"],        difficulty: "Medium" },
    ],
  },
];

// ── Seed logic ────────────────────────────────────────────────────────────────

async function upsertBatch(def) {
  const { slug, announcements, schedule, ...fields } = def;

  let batch = await Batch.findOne({ slug });

  if (!batch) {
    batch = await Batch.create({ slug, ...fields, announcements: [], schedule: [] });
    log(`Created batch: ${batch.title}`);
  } else {
    log(`Batch exists: ${batch.title} — skipping core fields`);
  }

  // Add missing announcements (match by title)
  let annAdded = 0;
  for (const ann of announcements) {
    const exists = batch.announcements.some((a) => a.title === ann.title);
    if (!exists) {
      batch.announcements.push(ann);
      annAdded++;
    }
  }

  // Add missing schedule items (match by title)
  let schedAdded = 0;
  for (const item of schedule) {
    const exists = batch.schedule.some((s) => s.title === item.title);
    if (!exists) {
      batch.schedule.push(item);
      schedAdded++;
    }
  }

  if (annAdded > 0 || schedAdded > 0) {
    await batch.save();
    if (annAdded) log(`  Added ${annAdded} announcement(s) to ${batch.title}`);
    if (schedAdded) log(`  Added ${schedAdded} schedule item(s) to ${batch.title}`);
  }

  return batch;
}

async function upsertLecture(lecDef, batchMap) {
  const batch = batchMap[lecDef.batchSlug];
  if (!batch) { log(`  WARN: no batch found for slug ${lecDef.batchSlug}`); return; }

  const existing = await Lecture.findOne({ slug: lecDef.slug });
  if (existing) {
    log(`  Lecture exists: ${lecDef.title}`);
    return existing;
  }

  const lecture = await Lecture.create({
    slug:                 lecDef.slug,
    title:                lecDef.title,
    batchId:              batch._id,
    module:               lecDef.module,
    description:          lecDef.description,
    youtubeVideoId:       lecDef.youtubeVideoId,
    duration:             lecDef.duration,
    order:                lecDef.order,
    isLiveClassRecording: lecDef.isLiveClassRecording,
  });

  log(`  Created lecture: ${lecture.title}`);
  return lecture;
}

async function upsertHomework(hwDef, batchMap) {
  const batch = batchMap[hwDef.batchSlug];
  if (!batch) { log(`  WARN: no batch found for slug ${hwDef.batchSlug}`); return; }

  const existing = await Homework.findOne({ batchId: batch._id, title: hwDef.title });
  if (existing) {
    log(`  Homework exists: ${hwDef.title}`);
    return existing;
  }

  const hw = await Homework.create({
    title:       hwDef.title,
    description: hwDef.description,
    batchId:     batch._id,
    dueDate:     hwDef.dueDate,
    problems:    hwDef.problems,
    difficulty:  hwDef.difficulty,
    xpReward:    hwDef.xpReward,
    isMandatory: hwDef.isMandatory,
  });

  log(`  Created homework: ${hw.title}`);
  return hw;
}

async function enrollUsers(batchMap) {
  const TIER_TO_SLUG = {
    FOUNDATION:  "foundation-batch",
    ACCELERATOR: "accelerator-batch",
    PLACEMENT:   "placement-batch",
  };

  let totalEnrolled = 0;

  for (const [tier, batchSlug] of Object.entries(TIER_TO_SLUG)) {
    const batch = batchMap[batchSlug];
    if (!batch) continue;

    const users = await User.find({ courseTier: tier }).select("_id fullName courseTier").lean();
    if (!users.length) {
      log(`  No ${tier} users found`);
      continue;
    }

    for (const user of users) {
      const alreadyEnrolled = batch.enrolledStudents.some(
        (id) => id.toString() === user._id.toString()
      );

      if (!alreadyEnrolled) {
        // Add user to batch.enrolledStudents
        await Batch.updateOne(
          { _id: batch._id },
          { $addToSet: { enrolledStudents: user._id } }
        );
        // Add batch to user.batches
        await User.updateOne(
          { _id: user._id },
          { $addToSet: { batches: batch._id } }
        );
        log(`  Enrolled ${user.fullName} (${tier}) → ${batch.title}`);
        totalEnrolled++;
      } else {
        log(`  Already enrolled: ${user.fullName} → ${batch.title}`);
      }
    }

    // Refresh in-memory batch doc so subsequent iterations see updated enrolledStudents
    const refreshed = await Batch.findById(batch._id).select("enrolledStudents").lean();
    batch.enrolledStudents = refreshed.enrolledStudents;
  }

  log(`\n  Total new enrollments: ${totalEnrolled}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await connectDB();

  // ── 1. Upsert batches ──────────────────────────────────────────────────────
  section("Batches");
  const batchMap = {};
  for (const def of BATCH_DEFS) {
    const batch = await upsertBatch(def);
    batchMap[def.slug] = batch;
  }

  // ── 2. Upsert lectures ─────────────────────────────────────────────────────
  section("Lectures");
  for (const def of LECTURE_DEFS) {
    await upsertLecture(def, batchMap);
  }

  // ── 3. Upsert homework ─────────────────────────────────────────────────────
  section("Homework");
  for (const def of HOMEWORK_DEFS) {
    await upsertHomework(def, batchMap);
  }

  // ── 4. Enroll users by tier ────────────────────────────────────────────────
  section("User Enrollment (tier-based)");
  await enrollUsers(batchMap);

  // ── 5. Summary ─────────────────────────────────────────────────────────────
  section("Summary");
  for (const [slug, batch] of Object.entries(batchMap)) {
    const fresh = await Batch.findById(batch._id).lean();
    const lCount = await Lecture.countDocuments({ batchId: batch._id });
    const hCount = await Homework.countDocuments({ batchId: batch._id });
    log(`${fresh.title}: ${fresh.enrolledStudents.length} students | ${lCount} lectures | ${hCount} homework | ${fresh.announcements.length} announcements | ${fresh.schedule.length} classes`);
  }

  console.log("\n✓ Seed complete\n");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
