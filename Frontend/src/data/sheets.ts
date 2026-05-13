export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  companies: string[];
  hasVideo?: boolean;
  hasArticle?: boolean;
}

export interface Sheet {
  slug: string;
  title: string;
  description: string;
  author: string;
  icon: string;
  problems: Problem[];
  tags: string[];
  colorFrom: string;
  colorTo: string;
  accentColor: string;
}

// ─── Sheet 1: Striver's SDE Sheet ────────────────────────────────────────────

const STRIVERS_PROBLEMS: Problem[] = [
  // Arrays I
  { id: "s01", title: "Set Matrix Zeroes", slug: "set-matrix-zeroes", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Microsoft", "Google"], hasVideo: true, hasArticle: true },
  { id: "s02", title: "Pascal's Triangle", slug: "pascals-triangle", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "s03", title: "Next Permutation", slug: "next-permutation", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "s04", title: "Maximum Subarray (Kadane's)", slug: "maximum-subarray", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Apple"], hasVideo: true, hasArticle: true },
  { id: "s05", title: "Sort Colors (Dutch Flag)", slug: "sort-colors", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Microsoft", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "s06", title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Bloomberg", "Google"], hasVideo: true, hasArticle: true },

  // Arrays II
  { id: "s07", title: "Rotate Image", slug: "rotate-image", difficulty: "Medium", topic: "Matrix", companies: ["Amazon", "Microsoft", "Apple"], hasVideo: true, hasArticle: true },
  { id: "s08", title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s09", title: "Merge Sorted Array", slug: "merge-sorted-array", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s10", title: "Find the Duplicate Number", slug: "find-the-duplicate-number", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },

  // Linked List
  { id: "s11", title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "s12", title: "Middle of the Linked List", slug: "middle-of-the-linked-list", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "s13", title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Meta", "Google"], hasVideo: true, hasArticle: true },
  { id: "s14", title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Meta", "Google"], hasVideo: true, hasArticle: true },
  { id: "s15", title: "Reverse Nodes in k-Group", slug: "reverse-nodes-in-k-group", difficulty: "Hard", topic: "Linked List", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },

  // Greedy
  { id: "s16", title: "Jump Game", slug: "jump-game", difficulty: "Medium", topic: "Greedy", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "s17", title: "Jump Game II", slug: "jump-game-ii", difficulty: "Medium", topic: "Greedy", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },

  // Trees
  { id: "s18", title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Tree", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "s19", title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", topic: "Tree", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "s20", title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", difficulty: "Hard", topic: "Tree", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },

  // DP
  { id: "s21", title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", topic: "DP", companies: ["Amazon", "Google", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "s22", title: "Coin Change", slug: "coin-change", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s23", title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },

  // Graphs
  { id: "s24", title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s25", title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Uber"], hasVideo: true, hasArticle: true },
  { id: "s26", title: "Word Ladder", slug: "word-ladder", difficulty: "Hard", topic: "Graph", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s27", title: "Clone Graph", slug: "clone-graph", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },

  // String
  { id: "s28", title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", topic: "String", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "s29", title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", topic: "String", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "s30", title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topic: "Stack", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
];

// ─── Sheet 2: Blind 75 ────────────────────────────────────────────────────────

const BLIND75_PROBLEMS: Problem[] = [
  { id: "b01", title: "Two Sum", slug: "two-sum", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Google", "Meta", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "b02", title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "b03", title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Google", "Apple"], hasVideo: true, hasArticle: true },
  { id: "b04", title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b05", title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Apple"], hasVideo: true, hasArticle: true },
  { id: "b06", title: "Maximum Product Subarray", slug: "maximum-product-subarray", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b07", title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", topic: "Binary Search", companies: ["Amazon", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "b08", title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", topic: "Binary Search", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "b09", title: "3Sum", slug: "3sum", difficulty: "Medium", topic: "Two Pointers", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b10", title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", topic: "Two Pointers", companies: ["Amazon", "Google", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "b11", title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b12", title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", topic: "Sliding Window", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b13", title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy", topic: "String", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b14", title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium", topic: "String", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b15", title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", topic: "Two Pointers", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "b16", title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Tree", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b17", title: "Invert Binary Tree", slug: "invert-binary-tree", difficulty: "Easy", topic: "Tree", companies: ["Amazon", "Google", "Apple"], hasVideo: true, hasArticle: true },
  { id: "b18", title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", difficulty: "Hard", topic: "Tree", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b19", title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", topic: "Tree", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "b20", title: "Lowest Common Ancestor of BST", slug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "Medium", topic: "Tree", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b21", title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", difficulty: "Medium", topic: "Tree", companies: ["Amazon", "Google", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "b22", title: "Kth Smallest Element in BST", slug: "kth-smallest-element-in-a-bst", difficulty: "Medium", topic: "Tree", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b23", title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b24", title: "Clone Graph", slug: "clone-graph", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b25", title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", topic: "DP", companies: ["Amazon", "Google", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "b26", title: "House Robber", slug: "house-robber", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b27", title: "House Robber II", slug: "house-robber-ii", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b28", title: "Coin Change", slug: "coin-change", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "b29", title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "b30", title: "Word Break", slug: "word-break", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
];

// ─── Sheet 3: NeetCode 150 ────────────────────────────────────────────────────

const NEETCODE_PROBLEMS: Problem[] = [
  { id: "n01", title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", topic: "Hashing", companies: ["Amazon", "Google", "Apple"], hasVideo: true, hasArticle: true },
  { id: "n02", title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy", topic: "Hashing", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n03", title: "Two Sum", slug: "two-sum", difficulty: "Easy", topic: "Hashing", companies: ["Amazon", "Google", "Meta", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "n04", title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium", topic: "Hashing", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n05", title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium", topic: "Heap", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n06", title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n07", title: "Valid Sudoku", slug: "valid-sudoku", difficulty: "Medium", topic: "Matrix", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n08", title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence", difficulty: "Medium", topic: "Hashing", companies: ["Google", "Meta", "Uber"], hasVideo: true, hasArticle: true },
  { id: "n09", title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", topic: "Two Pointers", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "n10", title: "3Sum", slug: "3sum", difficulty: "Medium", topic: "Two Pointers", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n11", title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", topic: "Two Pointers", companies: ["Amazon", "Google", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "n12", title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", topic: "Two Pointers", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n13", title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Sliding Window", companies: ["Amazon", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "n14", title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n15", title: "Permutation in String", slug: "permutation-in-string", difficulty: "Medium", topic: "Sliding Window", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n16", title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", topic: "Sliding Window", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n17", title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topic: "Stack", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n18", title: "Min Stack", slug: "min-stack", difficulty: "Medium", topic: "Stack", companies: ["Amazon", "Google", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "n19", title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation", difficulty: "Medium", topic: "Stack", companies: ["Amazon", "Bloomberg"], hasVideo: true, hasArticle: true },
  { id: "n20", title: "Generate Parentheses", slug: "generate-parentheses", difficulty: "Medium", topic: "Backtracking", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n21", title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", topic: "Stack", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n22", title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", topic: "Stack", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n23", title: "Binary Search", slug: "binary-search", difficulty: "Easy", topic: "Binary Search", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n24", title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", topic: "Binary Search", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "n25", title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", topic: "Binary Search", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "n26", title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "n27", title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List", companies: ["Amazon", "Meta", "Google"], hasVideo: true, hasArticle: true },
  { id: "n28", title: "LRU Cache", slug: "lru-cache", difficulty: "Medium", topic: "Linked List", companies: ["Amazon", "Google", "Meta", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "n29", title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Heap", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "n30", title: "Find the Duplicate Number", slug: "find-the-duplicate-number", difficulty: "Medium", topic: "Linked List", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
];

// ─── Sheet 4: Love Babbar 450 ─────────────────────────────────────────────────

const LOVEBABBAR_PROBLEMS: Problem[] = [
  // Arrays
  { id: "l01", title: "Reverse an Array", slug: "reverse-string", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Flipkart"], hasVideo: true, hasArticle: true },
  { id: "l02", title: "Find Maximum and Minimum of an Array", slug: "find-the-maximum-and-minimum", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Flipkart", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "l03", title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "l04", title: "Sort an Array of 0s, 1s, 2s", slug: "sort-colors", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Microsoft", "Adobe"], hasVideo: true, hasArticle: true },
  { id: "l05", title: "Move Negatives to Beginning", slug: "move-zeroes", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Flipkart"], hasVideo: true, hasArticle: true },
  { id: "l06", title: "Cyclically Rotate Array by One", slug: "rotate-array", difficulty: "Easy", topic: "Array", companies: ["Amazon"], hasVideo: true, hasArticle: true },
  { id: "l07", title: "Minimize the Maximum Difference of Pairs", slug: "minimize-the-maximum-difference-of-pairs", difficulty: "Medium", topic: "Array", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "l08", title: "Find Equilibrium Point", slug: "find-pivot-index", difficulty: "Easy", topic: "Array", companies: ["Amazon", "Adobe"], hasVideo: true, hasArticle: true },
  // Matrix
  { id: "l09", title: "Spiral Order Matrix Traversal", slug: "spiral-matrix", difficulty: "Medium", topic: "Matrix", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "l10", title: "Search in a 2D Matrix", slug: "search-a-2d-matrix", difficulty: "Medium", topic: "Matrix", companies: ["Amazon", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "l11", title: "Find Median in Row-Wise Sorted Matrix", slug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Matrix", companies: ["Amazon", "Flipkart", "Google"], hasVideo: true, hasArticle: true },
  // Strings
  { id: "l12", title: "Reverse a String", slug: "reverse-string", difficulty: "Easy", topic: "String", companies: ["Amazon"], hasVideo: true, hasArticle: true },
  { id: "l13", title: "Check if String is Palindrome", slug: "valid-palindrome", difficulty: "Easy", topic: "String", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "l14", title: "Find All Anagrams in a String", slug: "find-all-anagrams-in-a-string", difficulty: "Medium", topic: "String", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "l15", title: "Longest Common Prefix", slug: "longest-common-prefix", difficulty: "Easy", topic: "String", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "l16", title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", topic: "String", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  // DP
  { id: "l17", title: "Fibonacci Number", slug: "fibonacci-number", difficulty: "Easy", topic: "DP", companies: ["Amazon"], hasVideo: true, hasArticle: true },
  { id: "l18", title: "Longest Common Subsequence", slug: "longest-common-subsequence", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  { id: "l19", title: "0-1 Knapsack Problem", slug: "partition-equal-subset-sum", difficulty: "Medium", topic: "DP", companies: ["Amazon", "Flipkart", "Google"], hasVideo: true, hasArticle: true },
  { id: "l20", title: "Matrix Chain Multiplication", slug: "burst-balloons", difficulty: "Hard", topic: "DP", companies: ["Amazon", "Google"], hasVideo: true, hasArticle: true },
  { id: "l21", title: "Edit Distance", slug: "edit-distance", difficulty: "Hard", topic: "DP", companies: ["Amazon", "Google", "Meta"], hasVideo: true, hasArticle: true },
  { id: "l22", title: "Egg Dropping Puzzle", slug: "super-egg-drop", difficulty: "Hard", topic: "DP", companies: ["Amazon", "Google", "Microsoft"], hasVideo: true, hasArticle: true },
  // Graph
  { id: "l23", title: "Detect Cycle in Undirected Graph", slug: "number-of-provinces", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Flipkart"], hasVideo: true, hasArticle: true },
  { id: "l24", title: "Topological Sort (DFS)", slug: "course-schedule-ii", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Uber"], hasVideo: true, hasArticle: true },
  { id: "l25", title: "Shortest Path in Weighted Graph", slug: "network-delay-time", difficulty: "Medium", topic: "Graph", companies: ["Amazon", "Google", "Uber"], hasVideo: true, hasArticle: true },
];

// ─── Sheet definitions ─────────────────────────────────────────────────────────

export const SHEETS: Sheet[] = [
  {
    slug: "strivers-sde-sheet",
    title: "Striver's SDE Sheet",
    description: "The most popular interview prep sheet. 30 hand-picked problems that cover every topic asked in top product-based companies.",
    author: "Raj Vikramaditya (Striver)",
    icon: "🔥",
    problems: STRIVERS_PROBLEMS,
    tags: ["Array", "DP", "Graph", "Tree", "Linked List"],
    colorFrom: "#6366f1",
    colorTo: "#a855f7",
    accentColor: "#818cf8",
  },
  {
    slug: "blind-75",
    title: "Blind 75",
    description: "The legendary curated list of 75 LeetCode problems. Every serious candidate should solve these before stepping into an interview.",
    author: "Facebook Engineer (Anonymous)",
    icon: "👁️",
    problems: BLIND75_PROBLEMS,
    tags: ["Array", "DP", "Tree", "Graph", "String"],
    colorFrom: "#0ea5e9",
    colorTo: "#06b6d4",
    accentColor: "#38bdf8",
  },
  {
    slug: "neetcode-150",
    title: "NeetCode 150",
    description: "A structured roadmap of 150 problems organized by pattern. Built for systematic learning with video explanations for every problem.",
    author: "NeetCode (Navdeep Singh)",
    icon: "🚀",
    problems: NEETCODE_PROBLEMS,
    tags: ["Two Pointers", "Sliding Window", "Stack", "Binary Search", "Heap"],
    colorFrom: "#10b981",
    colorTo: "#059669",
    accentColor: "#34d399",
  },
  {
    slug: "love-babbar-450",
    title: "Love Babbar 450",
    description: "The ultimate DSA sheet for placement prep. 450 problems spanning every topic from basic arrays to advanced graphs and DP.",
    author: "Love Babbar",
    icon: "💡",
    problems: LOVEBABBAR_PROBLEMS,
    tags: ["Array", "Matrix", "String", "DP", "Graph"],
    colorFrom: "#f59e0b",
    colorTo: "#ef4444",
    accentColor: "#fbbf24",
  },
];

// ─── Progress persistence ──────────────────────────────────────────────────────

function progressKey(userId: string, sheetSlug: string) {
  return `ck_solved_${userId}_${sheetSlug}`;
}

function bookmarkKey(userId: string, sheetSlug: string) {
  return `ck_bm_${userId}_${sheetSlug}`;
}

export function loadSolved(userId: string, sheetSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(progressKey(userId, sheetSlug));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSolved(userId: string, sheetSlug: string, ids: Set<string>): void {
  localStorage.setItem(progressKey(userId, sheetSlug), JSON.stringify([...ids]));
}

export function loadBookmarks(userId: string, sheetSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(bookmarkKey(userId, sheetSlug));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveBookmarks(userId: string, sheetSlug: string, ids: Set<string>): void {
  localStorage.setItem(bookmarkKey(userId, sheetSlug), JSON.stringify([...ids]));
}
