import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { getAcademyTitle } from "../utils/ratingSystem.js";

function buildHeatmap(activityLog) {
  const map = new Map();
  for (const entry of activityLog) {
    map.set(entry.date, (map.get(entry.date) ?? 0) + entry.count);
  }

  const today = new Date();
  return Array.from({ length: 364 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (363 - i));
    const date = d.toISOString().slice(0, 10);
    const count = map.get(date) ?? 0;
    let intensity = 0;
    if (count >= 5) intensity = 3;
    else if (count >= 3) intensity = 2;
    else if (count >= 1) intensity = 1;
    return { date, count, intensity };
  });
}

function computeAchievements(user, hwCompleted) {
  const solved = user.problemsSolved ?? 0;
  const participated = user.contestsParticipated ?? 0;
  const streak = user.streak ?? 0;

  return [
    {
      id: "homework_warrior",
      title: "Homework Warrior",
      desc: "Complete 50 assignments",
      colorKey: "green",
      earned: hwCompleted >= 50,
      progress: Math.min(hwCompleted, 50),
      total: 50,
    },
    {
      id: "contest_grinder",
      title: "Contest Grinder",
      desc: "Join 10 rated contests",
      colorKey: "indigo",
      earned: participated >= 10,
      progress: Math.min(participated, 10),
      total: 10,
    },
    {
      id: "elite_coder",
      title: "Elite Coder",
      desc: "Solve 500 problems",
      colorKey: "purple",
      earned: solved >= 500,
      progress: Math.min(solved, 500),
      total: 500,
    },
    {
      id: "consistency",
      title: "Consistency",
      desc: "30-day streak",
      colorKey: "cyan",
      earned: streak >= 30,
      progress: Math.min(streak, 30),
      total: 30,
    },
  ];
}

// GET /api/users/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select(
      "xp level streak academyRating academyRankTitle problemsSolved " +
      "contestsParticipated homeworkProgress activityLog batches fullName avatar"
    )
    .lean();

  // Global rank = number of users with strictly more XP + 1
  const globalRank = (await User.countDocuments({ xp: { $gt: user.xp } })) + 1;

  // Homework stats
  const hw = user.homeworkProgress ?? [];
  const hwCompleted = hw.filter((h) => h.status === "completed").length;
  const hwTotal = hw.length;
  const hwPct = hwTotal > 0 ? Math.round((hwCompleted / hwTotal) * 100) : 0;

  // Leaderboard: top 5 users by XP
  const top5 = await User.find()
    .select("_id fullName avatar xp")
    .sort({ xp: -1 })
    .limit(5)
    .lean();

  const leaderboard = top5.map((u, i) => ({
    rank: i + 1,
    name: u.fullName,
    avatar: u.avatar?.length <= 3 ? u.avatar : u.fullName.slice(0, 2).toUpperCase(),
    xp: u.xp,
    isCurrentUser: u._id.toString() === userId.toString(),
  }));

  const inTop5 = top5.some((u) => u._id.toString() === userId.toString());
  if (!inTop5) {
    leaderboard.push({
      rank: globalRank,
      name: user.fullName,
      avatar: user.avatar?.length <= 3 ? user.avatar : user.fullName.slice(0, 2).toUpperCase(),
      xp: user.xp,
      isCurrentUser: true,
    });
  }

  // Heatmap
  const heatmap = buildHeatmap(user.activityLog ?? []);
  const activeDays = heatmap.filter((c) => c.count > 0).length;

  const rankTitle =
    user.academyRankTitle || getAcademyTitle(user.academyRating ?? 1200);

  res.json({
    success: true,
    data: {
      stats: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        rank: globalRank,
        rating: user.academyRating ?? 1200,
        rankTitle,
        solved: user.problemsSolved ?? 0,
        hwCompleted,
        hwTotal,
        hwPct,
        contestsParticipated: user.contestsParticipated ?? 0,
        enrolledBatches: user.batches?.length ?? 0,
        activeDays,
      },
      leaderboard,
      heatmap,
      achievements: computeAchievements(user, hwCompleted),
      recentActivity: [],
    },
  });
});
