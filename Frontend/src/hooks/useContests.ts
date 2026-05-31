import { useQuery } from "@tanstack/react-query";
import { contestApi, type ApiContest, type ApiLeaderboardUser, type ApiAnalytics } from "@/lib/api";
import type { Contest, PreviousContest, LeaderboardUser } from "@/lib/data/contests";

// ── Transform helpers ─────────────────────────────────────────────────────────

function apiContestToFrontend(c: ApiContest): Contest {
  return {
    id: c._id,
    title: c.title,
    date: new Date(c.startTime).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time:
      new Date(c.startTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }) + " IST",
    duration: c.duration,
    difficulty: c.difficulty,
    topics: c.topics,
    xpReward: c.xpReward,
    codeforcesUrl: c.codeforcesContestLink,
    startTimestamp: new Date(c.startTime).getTime(),
  };
}

type RawPreviousItem = ApiContest & {
  userResult: {
    globalRank: number;
    solved: number;
    ratingChange: number;
    xpEarned: number;
  } | null;
};

function apiPreviousToFrontend(c: RawPreviousItem, index: number): PreviousContest {
  return {
    id: c._id,
    number: index + 1,
    title: c.title,
    date: new Date(c.startTime ?? "").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    rank: c.userResult?.globalRank ?? 0,
    solved: c.userResult?.solved ?? 0,
    total: 4,
    ratingChange: c.userResult?.ratingChange ?? 0,
    xpEarned: c.userResult?.xpEarned ?? 0,
  };
}

function apiLeaderboardToFrontend(u: ApiLeaderboardUser): LeaderboardUser {
  const words = u.name.split(" ").filter(Boolean);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : u.name.slice(0, 2).toUpperCase();
  return {
    rank: u.rank,
    name: u.name,
    initials,
    rating: u.rating,
    xp: u.xp,
    solved: u.participated * 2,
    badge: u.badge,
  };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useUpcomingContests() {
  return useQuery<ApiContest[], Error, Contest[]>({
    queryKey: ["contests", "upcoming"],
    queryFn: contestApi.getUpcoming,
    staleTime: 2 * 60_000,
    select: (data) => data.map(apiContestToFrontend),
  });
}

export function usePreviousContests() {
  return useQuery<RawPreviousItem[], Error, PreviousContest[]>({
    queryKey: ["contests", "previous"],
    queryFn: contestApi.getPrevious as () => Promise<RawPreviousItem[]>,
    staleTime: 5 * 60_000,
    select: (data) => data.map((c, i) => apiPreviousToFrontend(c, i)),
  });
}

export function useLeaderboard() {
  return useQuery<ApiLeaderboardUser[], Error, LeaderboardUser[]>({
    queryKey: ["contests", "leaderboard"],
    queryFn: contestApi.getLeaderboard,
    staleTime: 5 * 60_000,
    select: (data) => data.map(apiLeaderboardToFrontend),
  });
}

export function useContestAnalytics() {
  return useQuery<ApiAnalytics>({
    queryKey: ["contests", "analytics"],
    queryFn: contestApi.getAnalytics,
    staleTime: 5 * 60_000,
  });
}

/** Combined hero stats derived from the user's analytics from the API */
export function useContestStats() {
  const { data } = useContestAnalytics();
  return {
    rating:        data?.stats.rating       ?? 1200,
    rankTitle:     data?.stats.rankTitle    ?? "Pupil",
    totalXP:       data?.stats.totalXP      ?? 0,
    participated:  data?.stats.participated ?? 0,
    bestRank:      data?.stats.bestRank     ?? null,
    avgRank:       data?.stats.avgRank      ?? null,
    winRate:       data?.stats.winRate      ?? 0,
    ratingHistory: data?.ratingHistory      ?? [],
    xpHistory:     data?.xpHistory          ?? [],
  };
}
