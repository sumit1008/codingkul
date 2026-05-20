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

export const upcomingContests: Contest[] = [
  {
    id: "wc-12",
    title: "Weekly Contest #12",
    date: "May 25, 2026",
    time: "8:00 PM IST",
    duration: "2 hours",
    difficulty: "Intermediate",
    topics: ["Graphs", "Binary Search", "Greedy"],
    xpReward: 300,
    codeforcesUrl: "https://codeforces.com",
    startTimestamp: new Date("2026-05-25T14:30:00Z").getTime(),
  },
  {
    id: "wc-13",
    title: "Weekly Contest #13",
    date: "June 1, 2026",
    time: "8:00 PM IST",
    duration: "2 hours",
    difficulty: "Advanced",
    topics: ["Dynamic Programming", "Trees", "Math"],
    xpReward: 400,
    codeforcesUrl: "https://codeforces.com",
    startTimestamp: new Date("2026-06-01T14:30:00Z").getTime(),
  },
];

export const previousContests: PreviousContest[] = [
  { id: "wc-11", number: 11, title: "Weekly Contest #11", date: "May 11, 2026",  rank: 24, solved: 3, total: 4, ratingChange: 54,  xpEarned: 250 },
  { id: "wc-10", number: 10, title: "Weekly Contest #10", date: "May 4, 2026",   rank: 18, solved: 4, total: 4, ratingChange: 68,  xpEarned: 300 },
  { id: "wc-9",  number: 9,  title: "Weekly Contest #9",  date: "Apr 27, 2026",  rank: 31, solved: 2, total: 4, ratingChange: -12, xpEarned: 150 },
  { id: "wc-8",  number: 8,  title: "Weekly Contest #8",  date: "Apr 20, 2026",  rank: 22, solved: 3, total: 4, ratingChange: 45,  xpEarned: 250 },
];

export const ratingHistory: RatingPoint[] = [
  { month: "Jan", rating: 1200 },
  { month: "Feb", rating: 1280 },
  { month: "Mar", rating: 1350 },
  { month: "Apr", rating: 1430 },
  { month: "May", rating: 1542 },
];

export const xpHistory: XpPoint[] = [
  { month: "Jan", xp: 1800 },
  { month: "Feb", xp: 2400 },
  { month: "Mar", xp: 2100 },
  { month: "Apr", xp: 3200 },
  { month: "May", xp: 2950 },
];

export const globalLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Aryan Sharma", initials: "AS", rating: 1890, xp: 18420, solved: 247, badge: "Grandmaster" },
  { rank: 2, name: "Rahul Kumar",  initials: "RK", rating: 1812, xp: 17100, solved: 234, badge: "Master" },
  { rank: 3, name: "Priya Patel",  initials: "PP", rating: 1765, xp: 16880, solved: 229, badge: "Master" },
  { rank: 4, name: "Sneha Gupta",  initials: "SG", rating: 1698, xp: 15200, solved: 198, badge: "Expert" },
  { rank: 5, name: "Vikram Singh", initials: "VS", rating: 1645, xp: 14600, solved: 187, badge: "Expert" },
];

export const batchLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Pooja Mehta",  initials: "PM", rating: 1720, xp: 14800, solved: 212, badge: "Expert" },
  { rank: 2, name: "Dev Patel",    initials: "DP", rating: 1680, xp: 13900, solved: 201, badge: "Expert" },
  { rank: 3, name: "Kavya Sharma", initials: "KS", rating: 1620, xp: 12400, solved: 176, badge: "Specialist" },
  { rank: 4, name: "Rohan Mishra", initials: "RM", rating: 1580, xp: 11200, solved: 162, badge: "Specialist" },
  { rank: 5, name: "Ananya Das",   initials: "AD", rating: 1542, xp: 10800, solved: 148, badge: "Specialist" },
];
