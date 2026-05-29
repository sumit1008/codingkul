export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "LeetCode" | "Codeforces" | "GeeksforGeeks" | "CodingNinjas" | "AtCoder" | "Other";
export type ContestStatus = "upcoming" | "running" | "completed";
export type ContestDifficulty = "Beginner" | "Intermediate" | "Advanced";

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

export interface AdminContest {
  _id: string;
  title: string;
  slug: string;
  codeforcesContestId: number;
  codeforcesContestLink: string;
  startTime: string;
  endTime: string;
  duration: string;
  difficulty: ContestDifficulty;
  topics: string[];
  xpReward: number;
  status: ContestStatus;
  processedResults: boolean;
  participantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContestParticipant {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
  } | null;
  cfHandle: string;
  globalRank: number;
  solved: number;
  penalty: number;
  ratingChange: number;
  xpEarned: number;
  academyRatingAfter: number;
  createdAt: string;
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

export const CONTEST_DIFFICULTIES: ContestDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

// ── Batch types ──────────────────────────────────────────────────────────────

export type HwDifficulty = "Easy" | "Medium" | "Hard";
export type HwPlatform   = "LeetCode" | "Codeforces" | "GeeksforGeeks" | "CodingNinjas" | "AtCoder" | "Other";

export interface AdminBatch {
  _id: string;
  title: string;
  slug: string;
  description: string;
  courseId?: string;
  instructorName: string;
  meetLink?: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  enrolledStudents: string[];
  lectureCount?: number;
  hwCount?: number;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLecture {
  _id: string;
  title: string;
  slug: string;
  batchId: string;
  module: string;
  description: string;
  youtubeVideoId: string;
  duration: number;
  order: number;
  attachments: { name: string; url: string }[];
  unlockAt?: string;
  isLiveClassRecording: boolean;
  createdAt: string;
}

export interface AdminHomework {
  _id: string;
  title: string;
  description: string;
  batchId: string;
  lectureId?: string;
  dueDate: string;
  problems: {
    _id?: string;
    title: string;
    platform: HwPlatform;
    link: string;
    tags: string[];
    difficulty: HwDifficulty;
  }[];
  difficulty: HwDifficulty;
  xpReward: number;
  isMandatory: boolean;
  createdAt: string;
}

export const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber",
  "Airbnb", "Adobe", "Goldman Sachs", "Morgan Stanley", "Flipkart",
  "Walmart", "Oracle", "Cisco", "Infosys", "TCS", "Wipro", "HCL",
];
