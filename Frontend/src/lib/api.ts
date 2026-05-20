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

export const contestApi = {
  getUpcoming:     () => api.get<{ success: boolean; data: ApiContest[] }>("/contests/upcoming").then((r) => r.data.data),
  getPrevious:     () => api.get<{ success: boolean; data: (ApiContest & { userResult: ApiContestResult | null })[] }>("/contests/previous").then((r) => r.data.data),
  getLeaderboard:  () => api.get<{ success: boolean; data: ApiLeaderboardUser[] }>("/contests/leaderboard").then((r) => r.data.data),
  getAnalytics:    () => api.get<{ success: boolean; data: ApiAnalytics }>("/contests/analytics").then((r) => r.data.data),
  getPerformance:  () => api.get("/contests/performance").then((r) => r.data.data),
  linkCFHandle:    (handle: string) => api.patch("/contests/cf-handle", { codeforcesHandle: handle }).then((r) => r.data),
};
