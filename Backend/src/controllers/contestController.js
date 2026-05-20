import mongoose from "mongoose";
import Contest from "../models/Contest.js";
import ContestResult from "../models/ContestResult.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { getAcademyTitle } from "../utils/ratingSystem.js";
import { validateBody, cfHandleSchema } from "../validations/contestValidation.js";
import { validateCFHandle } from "../services/codeforcesService.js";

// ── GET /api/contests/upcoming ──────────────────────────────────────────────

export const getUpcomingContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ status: { $in: ["upcoming", "running"] } })
    .sort({ startTime: 1 })
    .lean();

  res.json({ success: true, data: contests });
});

// ── GET /api/contests/previous ─────────────────────────────────────────────

export const getPreviousContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ status: "completed" })
    .sort({ endTime: -1 })
    .limit(20)
    .lean();

  // If authenticated, attach user's result to each contest
  if (req.user) {
    const contestIds = contests.map((c) => c._id);
    const userResults = await ContestResult.find({
      userId: req.user._id,
      contestId: { $in: contestIds },
    }).lean();

    const resultMap = new Map(userResults.map((r) => [r.contestId.toString(), r]));

    const enriched = contests.map((c) => ({
      ...c,
      userResult: resultMap.get(c._id.toString()) ?? null,
    }));

    return res.json({ success: true, data: enriched });
  }

  res.json({ success: true, data: contests });
});

// ── GET /api/contests/:id ──────────────────────────────────────────────────

export const getContestById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Contest not found");
  }
  const contest = await Contest.findById(req.params.id).lean();
  if (!contest) {
    res.status(404);
    throw new Error("Contest not found");
  }

  let userResult = null;
  if (req.user) {
    userResult = await ContestResult.findOne({
      userId: req.user._id,
      contestId: contest._id,
    }).lean();
  }

  res.json({ success: true, data: { contest, userResult } });
});

// ── GET /api/contests/leaderboard ─────────────────────────────────────────

export const getLeaderboard = asyncHandler(async (req, res) => {
  const { type = "global", limit = 50 } = req.query;

  const users = await User.find({ contestsParticipated: { $gt: 0 } })
    .select("fullName username avatar academyRating academyRankTitle contestXP contestsParticipated contestBestRank")
    .sort({ academyRating: -1, contestXP: -1 })
    .limit(Number(limit))
    .lean();

  const ranked = users.map((u, i) => ({
    rank: i + 1,
    id: u._id,
    name: u.fullName,
    username: u.username,
    avatar: u.avatar,
    rating: u.academyRating ?? 1200,
    badge: u.academyRankTitle ?? getAcademyTitle(u.academyRating ?? 1200),
    xp: u.contestXP ?? 0,
    participated: u.contestsParticipated ?? 0,
    bestRank: u.contestBestRank ?? null,
  }));

  res.json({ success: true, data: ranked });
});

// ── GET /api/contests/analytics ───────────────────────────────────────────
// Returns analytics for the current logged-in user

export const getUserAnalytics = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("academyRating academyRankTitle contestXP contestsParticipated contestBestRank contestHistory")
    .lean();

  const history = user.contestHistory ?? [];
  const participated = history.length;

  // Best rank and average rank from history
  const ranks = history.map((h) => h.rank).filter(Boolean);
  const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;
  const avgRank = ranks.length > 0 ? Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length) : null;

  // Win rate (top 10 finishes)
  const topFinishes = ranks.filter((r) => r <= 10).length;
  const winRate = participated > 0 ? ((topFinishes / participated) * 100).toFixed(1) : "0.0";

  // Build monthly rating history
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ratingByMonth = new Map();
  const xpByMonth = new Map();

  for (const entry of history) {
    if (!entry.date) continue;
    const d = new Date(entry.date);
    const key = MONTHS[d.getMonth()];
    // Keep the most recent rating for that month
    ratingByMonth.set(key, entry.ratingAfter ?? user.academyRating);
    xpByMonth.set(key, (xpByMonth.get(key) ?? 0) + (entry.xpEarned ?? 0));
  }

  const ratingHistory = Array.from(ratingByMonth.entries()).map(([month, rating]) => ({ month, rating }));
  const xpHistory = Array.from(xpByMonth.entries()).map(([month, xp]) => ({ month, xp }));

  res.json({
    success: true,
    data: {
      stats: {
        rating: user.academyRating ?? 1200,
        rankTitle: user.academyRankTitle ?? "Pupil",
        totalXP: user.contestXP ?? 0,
        participated,
        bestRank,
        avgRank,
        winRate: Number(winRate),
      },
      ratingHistory,
      xpHistory,
      recentHistory: history.slice(-10).reverse(),
    },
  });
});

// ── GET /api/contests/performance ─────────────────────────────────────────
// Alias for analytics; also returns recent contest results with contest details

export const getUserPerformance = asyncHandler(async (req, res) => {
  const results = await ContestResult.find({ userId: req.user._id })
    .populate("contestId", "title slug difficulty startTime")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const user = await User.findById(req.user._id)
    .select("academyRating academyRankTitle contestXP contestsParticipated contestBestRank")
    .lean();

  res.json({
    success: true,
    data: {
      user: {
        rating: user.academyRating ?? 1200,
        rankTitle: user.academyRankTitle ?? "Pupil",
        totalXP: user.contestXP ?? 0,
        participated: user.contestsParticipated ?? 0,
        bestRank: user.contestBestRank ?? null,
      },
      results,
    },
  });
});

// ── PATCH /api/contests/cf-handle ─────────────────────────────────────────
// Let a user link their Codeforces handle

export const linkCodeforcesHandle = asyncHandler(async (req, res) => {
  const { codeforcesHandle } = validateBody(cfHandleSchema, req.body);

  // Verify the handle exists on Codeforces
  const cfUser = await validateCFHandle(codeforcesHandle);
  if (!cfUser) {
    res.status(400);
    throw new Error(`Codeforces handle "${codeforcesHandle}" not found`);
  }

  // Ensure no other user has claimed this handle
  const existing = await User.findOne({
    codeforcesHandle,
    _id: { $ne: req.user._id },
  });
  if (existing) {
    res.status(409);
    throw new Error("This Codeforces handle is already linked to another account");
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { codeforcesHandle } },
    { new: true, select: "codeforcesHandle academyRating academyRankTitle" }
  );

  res.json({ success: true, data: updated });
});
