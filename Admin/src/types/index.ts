export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "LeetCode" | "Codeforces" | "GeeksforGeeks" | "CodingNinjas" | "AtCoder" | "Other";

export interface Sheet {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  isPremium: boolean;
  order: number;
  totalProblems: number;
  accentColor: string;
  accentFrom: string;
  accentTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  subtopic: string;
  platform: Platform;
  problemUrl: string;
  editorialUrl: string;
  videoUrl: string;
  notes: string;
  tags: string[];
  companies: string[];
  order: number;
  sheetId: string | null;
  sheetTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyticsData {
  totalSheets: number;
  totalProblems: number;
  publishedSheets: number;
  difficultyBreakdown: { Easy: number; Medium: number; Hard: number };
  topicBreakdown: Array<{ topic: string; count: number }>;
  platformBreakdown: Array<{ platform: string; count: number }>;
  recentProblems: Problem[];
}

export const TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees",
  "Binary Search Trees", "Heaps", "Graphs", "Dynamic Programming",
  "Recursion & Backtracking", "Sorting", "Binary Search", "Two Pointers",
  "Sliding Window", "Prefix Sum", "Hashing", "Tries", "Segment Trees",
  "Bit Manipulation", "Math", "Greedy", "Divide & Conquer", "Advanced STL",
] as const;

export const PLATFORMS: Platform[] = [
  "LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other",
];

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber",
  "Airbnb", "Adobe", "Goldman Sachs", "Morgan Stanley", "Flipkart",
  "Walmart", "Oracle", "Cisco", "Infosys", "TCS", "Wipro", "HCL",
];
