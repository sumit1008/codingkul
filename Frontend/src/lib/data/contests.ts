export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Contest {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  difficulty: Difficulty;
  topics: string[];
  xpReward: number;
  codeforcesUrl: string;
  startTimestamp: number;
}

export interface PreviousContest {
  id: string;
  number: number;
  title: string;
  date: string;
  rank: number;
  solved: number;
  total: number;
  ratingChange: number;
  xpEarned: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  initials: string;
  rating: number;
  xp: number;
  solved: number;
  badge: string;
}

export interface RatingPoint {
  month: string;
  rating: number;
}

export interface XpPoint {
  month: string;
  xp: number;
}

