export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  companies: string[];
  hasVideo?: boolean;
  hasArticle?: boolean;
}

export interface TopicGroup {
  id: string;
  name: string;
  difficulty: Difficulty;
  xpReward: number;
  problems: Problem[];
}

export interface Sheet {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  isPremium: boolean;
  accentFrom: string;
  accentTo: string;
  accentColor: string;
  topics: TopicGroup[];
  features: string[];
  progressLabel: string;
  solvedLabel: string;
}

// Compact problem builder
const p = (
  id: string, title: string, slug: string,
  d: Difficulty, co: string[]
): Problem => ({ id, title, slug, difficulty: d, companies: co, hasVideo: true, hasArticle: true });

// ─── DSA Master Sheet ─────────────────────────────────────────────────────────

const MASTER_TOPICS: TopicGroup[] = [
  {
    id: "basics", name: "BASICS", difficulty: "Easy", xpReward: 750,
    problems: [
      p("m-b1", "Fibonacci Number", "fibonacci-number", "Easy", ["Amazon", "Google"]),
      p("m-b2", "Count Digits in a Number", "number-of-digits", "Easy", ["Amazon", "Adobe"]),
      p("m-b3", "Reverse a Number", "reverse-integer", "Easy", ["Amazon", "Google"]),
      p("m-b4", "Check Palindrome Number", "palindrome-number", "Easy", ["Amazon", "Microsoft"]),
      p("m-b5", "Check Armstrong Number", "armstrong-number", "Easy", ["Amazon"]),
      p("m-b6", "Find GCD / HCF", "greatest-common-divisor-of-strings", "Easy", ["Amazon", "Google"]),
      p("m-b7", "Sum of Digits", "add-digits", "Easy", ["Amazon"]),
      p("m-b8", "Count All Prime Numbers", "count-primes", "Easy", ["Amazon", "Google"]),
    ],
  },
  {
    id: "array", name: "ARRAY", difficulty: "Easy", xpReward: 1400,
    problems: [
      p("m-a1", "Find Maximum and Minimum", "find-the-maximum-and-minimum", "Easy", ["Amazon", "Flipkart"]),
      p("m-a2", "Reverse an Array", "reverse-string", "Easy", ["Amazon"]),
      p("m-a3", "Check if Array is Sorted", "check-if-array-is-sorted-and-rotated", "Easy", ["Amazon"]),
      p("m-a4", "Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy", ["Amazon", "Google"]),
      p("m-a5", "Left Rotate Array by K Places", "rotate-array", "Medium", ["Amazon", "Microsoft"]),
      p("m-a6", "Two Sum", "two-sum", "Easy", ["Amazon", "Google", "Meta"]),
      p("m-a7", "Sort Array of 0s, 1s, 2s", "sort-colors", "Easy", ["Amazon", "Microsoft"]),
      p("m-a8", "Find Missing Number", "missing-number", "Easy", ["Amazon", "Google"]),
      p("m-a9", "Find the Duplicate Number", "find-the-duplicate-number", "Medium", ["Amazon", "Google"]),
      p("m-a10", "Maximum Subarray (Kadane's)", "maximum-subarray", "Medium", ["Amazon", "Google", "Apple"]),
    ],
  },
  {
    id: "prefix", name: "PREFIX AND PARTIAL SUM", difficulty: "Medium", xpReward: 600,
    problems: [
      p("m-p1", "Running Sum of 1D Array", "running-sum-of-1d-array", "Easy", ["Amazon"]),
      p("m-p2", "Find Pivot Index", "find-pivot-index", "Easy", ["Amazon", "Google"]),
      p("m-p3", "Subarray Sum Equals K", "subarray-sum-equals-k", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-p4", "Product of Array Except Self", "product-of-array-except-self", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-p5", "Range Sum Query — Immutable", "range-sum-query-immutable", "Easy", ["Amazon"]),
      p("m-p6", "Count Number of Nice Subarrays", "count-number-of-nice-subarrays", "Medium", ["Amazon", "Google"]),
    ],
  },
  {
    id: "sorting", name: "SEARCHING AND SORTING", difficulty: "Medium", xpReward: 1000,
    problems: [
      p("m-s1", "Binary Search", "binary-search", "Easy", ["Amazon", "Google"]),
      p("m-s2", "First and Last Position of Element", "find-first-and-last-position-of-element-in-sorted-array", "Medium", ["Amazon", "Google"]),
      p("m-s3", "Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", ["Amazon", "Meta", "Microsoft"]),
      p("m-s4", "Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", ["Amazon", "Microsoft"]),
      p("m-s5", "Kth Largest Element in Array", "kth-largest-element-in-an-array", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-s6", "Merge Sorted Array", "merge-sorted-array", "Easy", ["Amazon", "Google", "Meta"]),
      p("m-s7", "Merge Intervals", "merge-intervals", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-s8", "Search a 2D Matrix", "search-a-2d-matrix", "Medium", ["Amazon", "Microsoft"]),
    ],
  },
  {
    id: "twopointer", name: "TWO POINTER", difficulty: "Medium", xpReward: 750,
    problems: [
      p("m-t1", "Valid Palindrome", "valid-palindrome", "Easy", ["Amazon", "Meta", "Microsoft"]),
      p("m-t2", "Two Sum II — Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "Medium", ["Amazon", "Google"]),
      p("m-t3", "3Sum", "3sum", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-t4", "Container With Most Water", "container-with-most-water", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("m-t5", "Trapping Rain Water", "trapping-rain-water", "Hard", ["Amazon", "Google", "Meta"]),
      p("m-t6", "Move Zeroes", "move-zeroes", "Easy", ["Amazon", "Microsoft"]),
    ],
  },
  {
    id: "sliding", name: "SLIDING WINDOW", difficulty: "Medium", xpReward: 600,
    problems: [
      p("m-sw1", "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-sw2", "Permutation in String", "permutation-in-string", "Medium", ["Amazon", "Google"]),
      p("m-sw3", "Minimum Window Substring", "minimum-window-substring", "Hard", ["Amazon", "Google", "Meta"]),
      p("m-sw4", "Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", ["Google", "Meta"]),
      p("m-sw5", "Maximum Sum Subarray of Size K", "maximum-average-subarray-i", "Easy", ["Amazon"]),
      p("m-sw6", "Fruit into Baskets", "fruit-into-baskets", "Medium", ["Amazon", "Google"]),
    ],
  },
  {
    id: "linkedlist", name: "LINKED LIST", difficulty: "Medium", xpReward: 750,
    problems: [
      p("m-l1", "Reverse Linked List", "reverse-linked-list", "Easy", ["Amazon", "Meta", "Microsoft"]),
      p("m-l2", "Middle of the Linked List", "middle-of-the-linked-list", "Easy", ["Amazon", "Adobe"]),
      p("m-l3", "Linked List Cycle", "linked-list-cycle", "Easy", ["Amazon", "Meta", "Google"]),
      p("m-l4", "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", ["Amazon", "Meta", "Google"]),
      p("m-l5", "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", ["Amazon", "Google"]),
      p("m-l6", "Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-l7", "Reverse Nodes in k-Group", "reverse-nodes-in-k-group", "Hard", ["Amazon", "Google", "Meta"]),
      p("m-l8", "Palindrome Linked List", "palindrome-linked-list", "Easy", ["Amazon", "Meta"]),
    ],
  },
  {
    id: "stack", name: "STACK AND QUEUE", difficulty: "Medium", xpReward: 600,
    problems: [
      p("m-sk1", "Valid Parentheses", "valid-parentheses", "Easy", ["Amazon", "Google", "Meta"]),
      p("m-sk2", "Min Stack", "min-stack", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("m-sk3", "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", ["Amazon", "Bloomberg"]),
      p("m-sk4", "Daily Temperatures", "daily-temperatures", "Medium", ["Amazon", "Google"]),
      p("m-sk5", "Next Greater Element I", "next-greater-element-i", "Easy", ["Amazon"]),
      p("m-sk6", "Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "trees", name: "TREES", difficulty: "Medium", xpReward: 1200,
    problems: [
      p("m-tr1", "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", ["Amazon", "Google"]),
      p("m-tr2", "Invert Binary Tree", "invert-binary-tree", "Easy", ["Amazon", "Google", "Apple"]),
      p("m-tr3", "Diameter of Binary Tree", "diameter-of-binary-tree", "Easy", ["Amazon", "Google"]),
      p("m-tr4", "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-tr5", "Binary Tree Right Side View", "binary-tree-right-side-view", "Medium", ["Amazon", "Google"]),
      p("m-tr6", "Lowest Common Ancestor", "lowest-common-ancestor-of-a-binary-tree", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-tr7", "Validate Binary Search Tree", "validate-binary-search-tree", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("m-tr8", "Kth Smallest Element in BST", "kth-smallest-element-in-a-bst", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-tr9", "Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", ["Amazon", "Google", "Meta"]),
      p("m-tr10", "Construct Binary Tree from Pre and Inorder", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", ["Amazon", "Google"]),
    ],
  },
  {
    id: "graphs", name: "GRAPHS", difficulty: "Hard", xpReward: 1500,
    problems: [
      p("m-g1", "Number of Islands", "number-of-islands", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-g2", "Clone Graph", "clone-graph", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-g3", "Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", ["Amazon", "Google"]),
      p("m-g4", "Course Schedule", "course-schedule", "Medium", ["Amazon", "Google", "Uber"]),
      p("m-g5", "Course Schedule II", "course-schedule-ii", "Medium", ["Amazon", "Google", "Uber"]),
      p("m-g6", "Number of Connected Components", "number-of-connected-components-in-an-undirected-graph", "Medium", ["Amazon", "Google"]),
      p("m-g7", "Rotting Oranges", "rotting-oranges", "Medium", ["Amazon", "Google"]),
      p("m-g8", "Word Ladder", "word-ladder", "Hard", ["Amazon", "Google", "Meta"]),
      p("m-g9", "Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium", ["Amazon", "Uber"]),
      p("m-g10", "Network Delay Time (Dijkstra's)", "network-delay-time", "Medium", ["Amazon", "Google", "Uber"]),
    ],
  },
  {
    id: "dp", name: "DYNAMIC PROGRAMMING", difficulty: "Hard", xpReward: 1800,
    problems: [
      p("m-dp1", "Climbing Stairs", "climbing-stairs", "Easy", ["Amazon", "Google", "Adobe"]),
      p("m-dp2", "House Robber", "house-robber", "Medium", ["Amazon", "Google"]),
      p("m-dp3", "House Robber II", "house-robber-ii", "Medium", ["Amazon", "Google"]),
      p("m-dp4", "Coin Change", "coin-change", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-dp5", "Longest Common Subsequence", "longest-common-subsequence", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-dp6", "0-1 Knapsack Problem", "partition-equal-subset-sum", "Medium", ["Amazon", "Flipkart", "Google"]),
      p("m-dp7", "Unique Paths", "unique-paths", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-dp8", "Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-dp9", "Word Break", "word-break", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-dp10", "Edit Distance", "edit-distance", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "backtracking", name: "BACKTRACKING", difficulty: "Hard", xpReward: 900,
    problems: [
      p("m-bt1", "Subsets", "subsets", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-bt2", "Permutations", "permutations", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-bt3", "Combination Sum", "combination-sum", "Medium", ["Amazon", "Google", "Meta"]),
      p("m-bt4", "Word Search", "word-search", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("m-bt5", "Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "Medium", ["Amazon", "Google"]),
      p("m-bt6", "N-Queens", "n-queens", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "greedy", name: "GREEDY ALGORITHMS", difficulty: "Medium", xpReward: 700,
    problems: [
      p("m-gr1", "Jump Game", "jump-game", "Medium", ["Amazon", "Google"]),
      p("m-gr2", "Jump Game II", "jump-game-ii", "Medium", ["Amazon", "Google"]),
      p("m-gr3", "Gas Station", "gas-station", "Medium", ["Amazon", "Google"]),
      p("m-gr4", "Non-overlapping Intervals", "non-overlapping-intervals", "Medium", ["Amazon", "Google"]),
      p("m-gr5", "Partition Labels", "partition-labels", "Medium", ["Amazon", "Google"]),
      p("m-gr6", "Merge Intervals", "merge-intervals", "Medium", ["Amazon", "Google", "Meta"]),
    ],
  },
];

// ─── I-200 FAANG Sheet ────────────────────────────────────────────────────────

const I200_TOPICS: TopicGroup[] = [
  {
    id: "i-hashing", name: "ARRAYS AND HASHING", difficulty: "Easy", xpReward: 800,
    problems: [
      p("i-h1", "Two Sum", "two-sum", "Easy", ["Amazon", "Google", "Meta", "Adobe"]),
      p("i-h2", "Contains Duplicate", "contains-duplicate", "Easy", ["Amazon", "Google", "Apple"]),
      p("i-h3", "Valid Anagram", "valid-anagram", "Easy", ["Amazon", "Google"]),
      p("i-h4", "Group Anagrams", "group-anagrams", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-h5", "Top K Frequent Elements", "top-k-frequent-elements", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-h6", "Product of Array Except Self", "product-of-array-except-self", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-h7", "Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium", ["Google", "Meta", "Uber"]),
      p("i-h8", "Encode and Decode Strings", "encode-and-decode-strings", "Medium", ["Google", "Meta"]),
    ],
  },
  {
    id: "i-twoptr", name: "TWO POINTERS", difficulty: "Easy", xpReward: 600,
    problems: [
      p("i-t1", "Valid Palindrome", "valid-palindrome", "Easy", ["Amazon", "Meta", "Microsoft"]),
      p("i-t2", "Two Sum II — Sorted", "two-sum-ii-input-array-is-sorted", "Medium", ["Amazon", "Google"]),
      p("i-t3", "3Sum", "3sum", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-t4", "Container With Most Water", "container-with-most-water", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("i-t5", "Trapping Rain Water", "trapping-rain-water", "Hard", ["Amazon", "Google", "Meta"]),
      p("i-t6", "4Sum", "4sum", "Medium", ["Amazon", "Google"]),
    ],
  },
  {
    id: "i-sliding", name: "SLIDING WINDOW", difficulty: "Medium", xpReward: 700,
    problems: [
      p("i-sw1", "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", ["Amazon", "Bloomberg"]),
      p("i-sw2", "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-sw3", "Permutation in String", "permutation-in-string", "Medium", ["Amazon", "Google"]),
      p("i-sw4", "Minimum Window Substring", "minimum-window-substring", "Hard", ["Amazon", "Google", "Meta"]),
      p("i-sw5", "Sliding Window Maximum", "sliding-window-maximum", "Hard", ["Amazon", "Google", "Meta"]),
      p("i-sw6", "Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", ["Google", "Meta"]),
    ],
  },
  {
    id: "i-stack", name: "STACK AND QUEUE", difficulty: "Medium", xpReward: 700,
    problems: [
      p("i-sk1", "Valid Parentheses", "valid-parentheses", "Easy", ["Amazon", "Google", "Meta"]),
      p("i-sk2", "Min Stack", "min-stack", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("i-sk3", "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", ["Amazon", "Bloomberg"]),
      p("i-sk4", "Generate Parentheses", "generate-parentheses", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-sk5", "Daily Temperatures", "daily-temperatures", "Medium", ["Amazon", "Google"]),
      p("i-sk6", "Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-binsearch", name: "BINARY SEARCH", difficulty: "Medium", xpReward: 700,
    problems: [
      p("i-bs1", "Binary Search", "binary-search", "Easy", ["Amazon", "Google"]),
      p("i-bs2", "Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", ["Amazon", "Meta", "Microsoft"]),
      p("i-bs3", "Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", ["Amazon", "Microsoft"]),
      p("i-bs4", "Koko Eating Bananas", "koko-eating-bananas", "Medium", ["Amazon", "Google"]),
      p("i-bs5", "Time Based Key-Value Store", "time-based-key-value-store", "Medium", ["Amazon", "Google"]),
      p("i-bs6", "Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-ll", name: "LINKED LIST", difficulty: "Medium", xpReward: 900,
    problems: [
      p("i-l1", "Reverse Linked List", "reverse-linked-list", "Easy", ["Amazon", "Meta", "Microsoft"]),
      p("i-l2", "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", ["Amazon", "Meta", "Google"]),
      p("i-l3", "Linked List Cycle", "linked-list-cycle", "Easy", ["Amazon", "Meta", "Google"]),
      p("i-l4", "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", ["Amazon", "Google"]),
      p("i-l5", "Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-l6", "LRU Cache", "lru-cache", "Medium", ["Amazon", "Google", "Meta", "Microsoft"]),
      p("i-l7", "Find the Duplicate Number", "find-the-duplicate-number", "Medium", ["Amazon", "Google"]),
      p("i-l8", "Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-trees", name: "TREES", difficulty: "Medium", xpReward: 1000,
    problems: [
      p("i-tr1", "Invert Binary Tree", "invert-binary-tree", "Easy", ["Amazon", "Google", "Apple"]),
      p("i-tr2", "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", ["Amazon", "Google"]),
      p("i-tr3", "Diameter of Binary Tree", "diameter-of-binary-tree", "Easy", ["Amazon", "Google"]),
      p("i-tr4", "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-tr5", "Binary Tree Right Side View", "binary-tree-right-side-view", "Medium", ["Amazon", "Google"]),
      p("i-tr6", "Validate Binary Search Tree", "validate-binary-search-tree", "Medium", ["Amazon", "Google", "Bloomberg"]),
      p("i-tr7", "Kth Smallest Element in BST", "kth-smallest-element-in-a-bst", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-tr8", "Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-heap", name: "HEAP AND PRIORITY QUEUE", difficulty: "Medium", xpReward: 700,
    problems: [
      p("i-hp1", "Kth Largest Element in Array", "kth-largest-element-in-an-array", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-hp2", "Top K Frequent Elements", "top-k-frequent-elements", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-hp3", "Find Median from Data Stream", "find-median-from-data-stream", "Hard", ["Amazon", "Google", "Meta"]),
      p("i-hp4", "K Closest Points to Origin", "k-closest-points-to-origin", "Medium", ["Amazon", "Google", "Facebook"]),
      p("i-hp5", "Task Scheduler", "task-scheduler", "Medium", ["Amazon", "Google"]),
      p("i-hp6", "Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-graphs", name: "GRAPHS", difficulty: "Hard", xpReward: 1500,
    problems: [
      p("i-g1", "Number of Islands", "number-of-islands", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-g2", "Max Area of Island", "max-area-of-island", "Medium", ["Amazon", "Google"]),
      p("i-g3", "Clone Graph", "clone-graph", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-g4", "Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", ["Amazon", "Google"]),
      p("i-g5", "Course Schedule", "course-schedule", "Medium", ["Amazon", "Google", "Uber"]),
      p("i-g6", "Course Schedule II", "course-schedule-ii", "Medium", ["Amazon", "Google", "Uber"]),
      p("i-g7", "Redundant Connection", "redundant-connection", "Medium", ["Amazon", "Google"]),
      p("i-g8", "Word Ladder", "word-ladder", "Hard", ["Amazon", "Google", "Meta"]),
      p("i-g9", "Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium", ["Amazon", "Uber"]),
      p("i-g10", "Network Delay Time", "network-delay-time", "Medium", ["Amazon", "Google", "Uber"]),
    ],
  },
  {
    id: "i-dp", name: "DYNAMIC PROGRAMMING", difficulty: "Hard", xpReward: 2000,
    problems: [
      p("i-dp1", "Climbing Stairs", "climbing-stairs", "Easy", ["Amazon", "Google", "Adobe"]),
      p("i-dp2", "Min Cost Climbing Stairs", "min-cost-climbing-stairs", "Easy", ["Amazon", "Google"]),
      p("i-dp3", "House Robber", "house-robber", "Medium", ["Amazon", "Google"]),
      p("i-dp4", "House Robber II", "house-robber-ii", "Medium", ["Amazon", "Google"]),
      p("i-dp5", "Longest Palindromic Substring", "longest-palindromic-substring", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-dp6", "Coin Change", "coin-change", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-dp7", "Maximum Product Subarray", "maximum-product-subarray", "Medium", ["Amazon", "Google"]),
      p("i-dp8", "Word Break", "word-break", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-dp9", "Combination Sum IV", "combination-sum-iv", "Medium", ["Amazon", "Google"]),
      p("i-dp10", "Unique Paths", "unique-paths", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-dp11", "Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-dp12", "Edit Distance", "edit-distance", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
  {
    id: "i-bt", name: "BACKTRACKING", difficulty: "Hard", xpReward: 1000,
    problems: [
      p("i-bt1", "Subsets", "subsets", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-bt2", "Combination Sum", "combination-sum", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-bt3", "Permutations", "permutations", "Medium", ["Amazon", "Google", "Meta"]),
      p("i-bt4", "Word Search", "word-search", "Medium", ["Amazon", "Google", "Microsoft"]),
      p("i-bt5", "Palindrome Partitioning", "palindrome-partitioning", "Medium", ["Amazon", "Google"]),
      p("i-bt6", "N-Queens", "n-queens", "Hard", ["Amazon", "Google", "Meta"]),
    ],
  },
];

// ─── Sheet definitions ─────────────────────────────────────────────────────────

export const SHEETS: Sheet[] = [
  {
    slug: "dsa-master-sheet",
    title: "DSA Master Sheet",
    subtitle: "Complete structured DSA roadmap with topic-wise progression",
    description: "Complete structured roadmap with 13 ordered topics covering all fundamental DSA concepts",
    isPremium: false,
    accentFrom: "#06b6d4",
    accentTo: "#22d3ee",
    accentColor: "#22d3ee",
    topics: MASTER_TOPICS,
    features: [
      "Topic-wise progression system",
      "108+ curated problems",
      "Unlockable topics & achievements",
    ],
    progressLabel: "Your Progress",
    solvedLabel: "Completion",
  },
  {
    slug: "i-200-sheet",
    title: "I-200 Sheet",
    subtitle: "Top 200 most important interview problems curated from FAANG interviews",
    description: "Top 200 most important interview problems curated from FAANG interviews",
    isPremium: true,
    accentFrom: "#8b5cf6",
    accentTo: "#a855f7",
    accentColor: "#a855f7",
    topics: I200_TOPICS,
    features: [
      "High-frequency interview questions",
      "Company-wise problem tags",
      "Interview readiness tracking",
    ],
    progressLabel: "Problems Solved",
    solvedLabel: "Readiness",
  },
];

// ─── Progress helpers ──────────────────────────────────────────────────────────

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
  } catch { return new Set(); }
}
export function saveSolved(userId: string, sheetSlug: string, ids: Set<string>): void {
  localStorage.setItem(progressKey(userId, sheetSlug), JSON.stringify([...ids]));
}
export function loadBookmarks(userId: string, sheetSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(bookmarkKey(userId, sheetSlug));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
export function saveBookmarks(userId: string, sheetSlug: string, ids: Set<string>): void {
  localStorage.setItem(bookmarkKey(userId, sheetSlug), JSON.stringify([...ids]));
}

// ─── Derived helpers ───────────────────────────────────────────────────────────

export function getTotalProblems(sheet: Sheet): number {
  return sheet.topics.reduce((acc, t) => acc + t.problems.length, 0);
}

export function getTotalXP(sheet: Sheet): number {
  return sheet.topics.reduce((acc, t) => acc + t.xpReward, 0);
}
