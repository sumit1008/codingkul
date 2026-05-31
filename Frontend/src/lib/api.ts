import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

// ── Contest API ──────────────────────────────────────────────────────────────

export interface ApiContest {
  _id: string;
  title: string;
  slug: string;
  codeforcesContestId: number;
  codeforcesContestLink: string;
  startTime: string;
  endTime: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  xpReward: number;
  status: "upcoming" | "running" | "completed";
}

export interface ApiContestResult {
  _id: string;
  cfHandle: string;
  globalRank: number;
  solved: number;
  penalty: number;
  ratingChange: number;
  xpEarned: number;
  academyRatingAfter: number;
  createdAt: string;
}

export interface ApiLeaderboardUser {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  badge: string;
  xp: number;
  participated: number;
  bestRank: number | null;
}

export interface ApiAnalytics {
  stats: {
    rating: number;
    rankTitle: string;
    totalXP: number;
    participated: number;
    bestRank: number | null;
    avgRank: number | null;
    winRate: number;
  };
  ratingHistory: { month: string; rating: number }[];
  xpHistory: { month: string; xp: number }[];
  recentHistory: {
    contestId: string;
    contestTitle: string;
    rank: number;
    solved: number;
    ratingChange: number;
    xpEarned: number;
    ratingAfter: number;
    date: string;
  }[];
}

// ── Batch API ────────────────────────────────────────────────────────────────

import type { BatchWithProgress, BatchActivity, BatchDetail, Lecture, Homework, HomeworkWithBatch, Announcement } from "@/types/batch";

export const batchApi = {
  getMyBatches:    () => api.get<{ success: boolean; data: BatchWithProgress[] }>("/batches").then((r) => r.data.data),
  getActivity:     () => api.get<{ success: boolean; data: BatchActivity | null }>("/batches/activity").then((r) => r.data.data),
  getAllHomework:   () => api.get<{ success: boolean; data: HomeworkWithBatch[] }>("/batches/homework").then((r) => r.data.data),
  getBySlug:      (slug: string) => api.get<{ success: boolean; data: BatchDetail }>(`/batches/${slug}`).then((r) => r.data.data),
  getLectures:    (slug: string) => api.get<{ success: boolean; data: Lecture[] }>(`/batches/${slug}/lectures`).then((r) => r.data.data),
  getLecture:     (slug: string, lectureId: string) =>
    api.get<{ success: boolean; data: { lecture: Lecture; prev: Lecture | null; next: Lecture | null; isCompleted: boolean } }>(
      `/batches/${slug}/lectures/${lectureId}`
    ).then((r) => r.data.data),
  toggleComplete: (slug: string, lectureId: string) =>
    api.post<{ success: boolean; data: { completed: boolean; watchedCount: number; xpGained: number } }>(
      `/batches/${slug}/lectures/${lectureId}/complete`
    ).then((r) => r.data.data),
  getHomework:    (slug: string) => api.get<{ success: boolean; data: Homework[] }>(`/batches/${slug}/homework`).then((r) => r.data.data),
  updateHomeworkProgress: (slug: string, hwId: string, status: string, solvedCount?: number) =>
    api.post<{ success: boolean; data: { status: string; xpGained: number } }>(
      `/batches/${slug}/homework/${hwId}/progress`, { status, solvedCount }
    ).then((r) => r.data.data),
  getAnnouncements: (slug: string) => api.get<{ success: boolean; data: Announcement[] }>(`/batches/${slug}/announcements`).then((r) => r.data.data),
};

// ── Dashboard API ────────────────────────────────────────────────────────────

export interface DashboardStats {
  xp: number;
  level: number;
  streak: number;
  rank: number;
  rating: number;
  rankTitle: string;
  solved: number;
  hwCompleted: number;
  hwTotal: number;
  hwPct: number;
  contestsParticipated: number;
  enrolledBatches: number;
  activeDays: number;
}

export interface DashboardLeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  isCurrentUser: boolean;
}

export interface DashboardHeatmapCell {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3;
}

export interface DashboardAchievement {
  id: string;
  title: string;
  desc: string;
  colorKey: "green" | "indigo" | "purple" | "cyan";
  earned: boolean;
  progress: number;
  total: number;
}

export interface DashboardData {
  stats: DashboardStats;
  leaderboard: DashboardLeaderboardEntry[];
  heatmap: DashboardHeatmapCell[];
  achievements: DashboardAchievement[];
  recentActivity: unknown[];
}

export const dashboardApi = {
  get: () =>
    api
      .get<{ success: boolean; data: DashboardData }>("/users/dashboard")
      .then((r) => r.data.data),
};

export const contestApi = {
  getUpcoming:     () => api.get<{ success: boolean; data: ApiContest[] }>("/contests/upcoming").then((r) => r.data.data),
  getPrevious:     () => api.get<{ success: boolean; data: (ApiContest & { userResult: ApiContestResult | null })[] }>("/contests/previous").then((r) => r.data.data),
  getLeaderboard:  () => api.get<{ success: boolean; data: ApiLeaderboardUser[] }>("/contests/leaderboard").then((r) => r.data.data),
  getAnalytics:    () => api.get<{ success: boolean; data: ApiAnalytics }>("/contests/analytics").then((r) => r.data.data),
  getPerformance:  () => api.get("/contests/performance").then((r) => r.data.data),
  linkCFHandle:    (handle: string) => api.patch("/contests/cf-handle", { codeforcesHandle: handle }).then((r) => r.data),
};
