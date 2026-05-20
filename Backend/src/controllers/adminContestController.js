import Contest from "../models/Contest.js";
import ContestResult from "../models/ContestResult.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateBody, createContestSchema, updateContestSchema } from "../validations/contestValidation.js";
import { processContest } from "../services/contestProcessor.js";

// ── GET /api/admin/contests ────────────────────────────────────────────────

export const listContests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const [contests, total] = await Promise.all([
    Contest.find(filter)
      .sort({ startTime: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean(),
    Contest.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { contests, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// ── POST /api/admin/contests/create ───────────────────────────────────────

export const createContest = asyncHandler(async (req, res) => {
  const data = validateBody(createContestSchema, req.body);

  // Check duplicate CF contest ID
  const exists = await Contest.findOne({ codeforcesContestId: data.codeforcesContestId });
  if (exists) {
    res.status(409);
    throw new Error(`A contest with Codeforces ID ${data.codeforcesContestId} already exists`);
  }

  const contest = await Contest.create({
    ...data,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: contest });
});

// ── PUT /api/admin/contests/update/:id ────────────────────────────────────

export const updateContest = asyncHandler(async (req, res) => {
  const data = validateBody(updateContestSchema, req.body);

  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    res.status(404);
    throw new Error("Contest not found");
  }

  // Prevent editing a processed contest's core fields
  if (contest.processedResults && (data.codeforcesContestId || data.startTime || data.endTime)) {
    res.status(400);
    throw new Error("Cannot change CF ID or times after results have been processed");
  }

  const updated = await Contest.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: updated });
});

// ── DELETE /api/admin/contests/delete/:id ─────────────────────────────────

export const deleteContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    res.status(404);
    throw new Error("Contest not found");
  }

  if (contest.processedResults) {
    res.status(400);
    throw new Error("Cannot delete a contest with processed results — archive it instead");
  }

  await Contest.findByIdAndDelete(req.params.id);
  await ContestResult.deleteMany({ contestId: contest._id });

  res.json({ success: true, message: "Contest deleted" });
});

// ── POST /api/admin/contests/:id/process ──────────────────────────────────
// Manually trigger result processing for a completed contest

export const triggerProcessing = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    res.status(404);
    throw new Error("Contest not found");
  }

  if (contest.status !== "completed") {
    res.status(400);
    throw new Error("Contest must be completed before processing results");
  }

  // Allow re-processing by resetting the flag first
  if (req.query.force === "true") {
    await Contest.findByIdAndUpdate(req.params.id, { processedResults: false });
  }

  const result = await processContest(contest._id);

  res.json({ success: true, data: result });
});

// ── PATCH /api/admin/contests/:id/status ──────────────────────────────────

export const updateContestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["upcoming", "running", "completed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const updated = await Contest.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Contest not found");
  }

  res.json({ success: true, data: updated });
});
