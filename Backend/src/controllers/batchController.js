import mongoose from "mongoose";
import Batch from "../models/Batch.js";
import Lecture from "../models/Lecture.js";
import Homework from "../models/Homework.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { homeworkProgressSchema, validateBody } from "../validations/batchValidation.js";

// ── GET /api/batches  ─────────────────────────────────────────────────────────
// Returns all batches the logged-in student is enrolled in, with progress.

export const getMyBatches = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("batches batchProgress homeworkProgress")
    .lean();

  if (!user.batches?.length) return res.json({ success: true, data: [] });

  const batches = await Batch.find({
    _id: { $in: user.batches },
    isActive: true,
  })
    .select("title slug description instructorName bannerImage startDate endDate schedule announcements")
    .lean();

  const batchObjectIds = batches.map((b) => b._id);

  const [lectureCounts, homeworkList] = await Promise.all([
    Lecture.aggregate([
      { $match: { batchId: { $in: batchObjectIds } } },
      { $group: { _id: "$batchId", count: { $sum: 1 } } },
    ]),
    Homework.find({ batchId: { $in: batchObjectIds } })
      .select("_id batchId dueDate")
      .lean(),
  ]);

  const lectureCountMap = Object.fromEntries(
    lectureCounts.map((l) => [l._id.toString(), l.count])
  );
  const progressMap = Object.fromEntries(
    (user.batchProgress ?? []).map((p) => [p.batchId.toString(), p])
  );
  const hwProgressMap = new Map(
    (user.homeworkProgress ?? []).map((p) => [p.homeworkId.toString(), p.status])
  );

  const now = new Date();

  const result = batches.map((batch) => {
    const bid = batch._id.toString();
    const bp = progressMap[bid] ?? {};
    const totalLectures = lectureCountMap[bid] ?? 0;
    const watchedCount = bp.watchedLectures?.length ?? 0;

    const batchHws = homeworkList.filter((h) => h.batchId.toString() === bid);
    const pendingHw = batchHws.filter((h) => {
      const s = hwProgressMap.get(h._id.toString());
      return !s || s === "pending" || s === "in-progress";
    }).length;

    const upcoming = batch.schedule
      .filter((s) => new Date(s.liveAt) > now && !s.isCompleted)
      .sort((a, b) => new Date(a.liveAt) - new Date(b.liveAt));

    const latestAnn = [...(batch.announcements ?? [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;

    return {
      batch,
      progress: {
        watchedCount,
        totalLectures,
        progressPercent: totalLectures > 0 ? Math.round((watchedCount / totalLectures) * 100) : 0,
        pendingHomework: pendingHw,
        nextClass: upcoming[0] ?? null,
        latestAnnouncement: latestAnn,
      },
    };
  });

  res.json({ success: true, data: result });
});

// ── GET /api/batches/activity  ────────────────────────────────────────────────
// Lightweight summary for dashboard widgets.

export const getBatchActivity = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("batches batchProgress homeworkProgress")
    .lean();

  if (!user.batches?.length) return res.json({ success: true, data: null });

  const now = new Date();

  // Get the most recently accessed batch
  const bpSorted = [...(user.batchProgress ?? [])].sort(
    (a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
  );
  const activeBatchId = bpSorted[0]?.batchId ?? user.batches[0];

  const batch = await Batch.findById(activeBatchId)
    .select("title slug instructorName schedule announcements isActive")
    .lean();

  if (!batch) return res.json({ success: true, data: null });

  const [totalLectures, hwList] = await Promise.all([
    Lecture.countDocuments({ batchId: activeBatchId }),
    Homework.find({ batchId: activeBatchId }).select("_id dueDate").lean(),
  ]);

  const bp = (user.batchProgress ?? []).find(
    (p) => p.batchId.toString() === activeBatchId.toString()
  );
  const watchedCount = bp?.watchedLectures?.length ?? 0;

  const hwProgressMap = new Map(
    (user.homeworkProgress ?? []).map((p) => [p.homeworkId.toString(), p.status])
  );
  const pendingHw = hwList.filter((h) => {
    const s = hwProgressMap.get(h._id.toString());
    return !s || s === "pending" || s === "in-progress";
  }).length;

  const nextClass = batch.schedule
    .filter((s) => new Date(s.liveAt) > now && !s.isCompleted)
    .sort((a, b) => new Date(a.liveAt) - new Date(b.liveAt))[0] ?? null;

  const latestAnn = [...(batch.announcements ?? [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;

  res.json({
    success: true,
    data: {
      batch: { _id: batch._id, title: batch.title, slug: batch.slug, instructorName: batch.instructorName },
      nextClass,
      pendingHomework: pendingHw,
      latestAnnouncement: latestAnn,
      progressPercent: totalLectures > 0 ? Math.round((watchedCount / totalLectures) * 100) : 0,
      totalBatches: user.batches.length,
    },
  });
});

// ── GET /api/batches/:slug  ───────────────────────────────────────────────────

export const getBatchBySlug = asyncHandler(async (req, res) => {
  const batch = await Batch.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const userId = req.user._id;

  // Verify enrollment
  const isEnrolled = batch.enrolledStudents.some(
    (id) => id.toString() === userId.toString()
  );
  if (!isEnrolled) { res.status(403); throw new Error("You are not enrolled in this batch"); }

  const [lectures, homework, user] = await Promise.all([
    Lecture.find({ batchId: batch._id }).sort({ order: 1 }).lean(),
    Homework.find({ batchId: batch._id }).sort({ dueDate: 1 }).lean(),
    User.findById(userId).select("batchProgress homeworkProgress").lean(),
  ]);

  const bp = (user.batchProgress ?? []).find(
    (p) => p.batchId.toString() === batch._id.toString()
  );
  const watched = new Set((bp?.watchedLectures ?? []).map((id) => id.toString()));

  const hwProgressMap = new Map(
    (user.homeworkProgress ?? []).map((p) => [p.homeworkId.toString(), p])
  );

  const now = new Date();

  const lecturesWithStatus = lectures.map((l) => ({
    ...l,
    isCompleted: watched.has(l._id.toString()),
    isUnlocked: !l.unlockAt || new Date(l.unlockAt) <= now,
  }));

  const homeworkWithStatus = homework.map((h) => {
    const prog = hwProgressMap.get(h._id.toString());
    let status = prog?.status ?? "pending";
    if (status !== "completed" && new Date(h.dueDate) < now) status = "overdue";
    return { ...h, status, solvedCount: prog?.solvedCount ?? 0, completedAt: prog?.completedAt };
  });

  const upcoming = batch.schedule
    .filter((s) => new Date(s.liveAt) > now && !s.isCompleted)
    .sort((a, b) => new Date(a.liveAt) - new Date(b.liveAt))
    .slice(0, 5);

  const announcements = [...(batch.announcements ?? [])]
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  res.json({
    success: true,
    data: {
      batch,
      lectures: lecturesWithStatus,
      homework: homeworkWithStatus,
      upcomingClasses: upcoming,
      announcements,
      progress: {
        watchedCount: watched.size,
        totalLectures: lectures.length,
        progressPercent: lectures.length > 0 ? Math.round((watched.size / lectures.length) * 100) : 0,
        completedHomework: homeworkWithStatus.filter((h) => h.status === "completed").length,
        totalHomework: homework.length,
      },
    },
  });
});

// ── GET /api/batches/:slug/lectures  ──────────────────────────────────────────

export const getBatchLectures = asyncHandler(async (req, res) => {
  const batch = await Batch.findOne({ slug: req.params.slug }).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const isEnrolled = batch.enrolledStudents.some(
    (id) => id.toString() === req.user._id.toString()
  );
  if (!isEnrolled) { res.status(403); throw new Error("Not enrolled"); }

  const [lectures, user] = await Promise.all([
    Lecture.find({ batchId: batch._id }).sort({ module: 1, order: 1 }).lean(),
    User.findById(req.user._id).select("batchProgress").lean(),
  ]);

  const bp = (user.batchProgress ?? []).find(
    (p) => p.batchId.toString() === batch._id.toString()
  );
  const watched = new Set((bp?.watchedLectures ?? []).map((id) => id.toString()));
  const now = new Date();

  const result = lectures.map((l) => ({
    ...l,
    isCompleted: watched.has(l._id.toString()),
    isUnlocked: !l.unlockAt || new Date(l.unlockAt) <= now,
  }));

  res.json({ success: true, data: result });
});

// ── GET /api/batches/:slug/lectures/:lectureId  ───────────────────────────────

export const getLectureById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.lectureId)) {
    res.status(404); throw new Error("Lecture not found");
  }

  const lecture = await Lecture.findById(req.params.lectureId)
    .populate("homeworkIds", "title dueDate difficulty xpReward isMandatory")
    .lean();
  if (!lecture) { res.status(404); throw new Error("Lecture not found"); }

  const [batch, allLectures, user] = await Promise.all([
    Batch.findById(lecture.batchId).select("enrolledStudents").lean(),
    Lecture.find({ batchId: lecture.batchId }).select("_id title slug order module").sort({ order: 1 }).lean(),
    User.findById(req.user._id).select("batchProgress").lean(),
  ]);

  const isEnrolled = batch?.enrolledStudents.some(
    (id) => id.toString() === req.user._id.toString()
  );
  if (!isEnrolled) { res.status(403); throw new Error("Not enrolled"); }

  const idx = allLectures.findIndex((l) => l._id.toString() === lecture._id.toString());
  const prev = idx > 0 ? allLectures[idx - 1] : null;
  const next = idx < allLectures.length - 1 ? allLectures[idx + 1] : null;
  const bp = (user.batchProgress ?? []).find(
    (p) => p.batchId.toString() === lecture.batchId.toString()
  );
  const isCompleted = bp?.watchedLectures?.some(
    (id) => id.toString() === lecture._id.toString()
  ) ?? false;

  res.json({ success: true, data: { lecture, prev, next, isCompleted } });
});

// ── POST /api/batches/:slug/lectures/:lectureId/complete  ─────────────────────

export const toggleLectureComplete = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.lectureId).lean();
  if (!lecture) { res.status(404); throw new Error("Lecture not found"); }

  const user = await User.findById(req.user._id);
  user.batchProgress = user.batchProgress ?? [];

  let bp = user.batchProgress.find(
    (p) => p.batchId.toString() === lecture.batchId.toString()
  );
  if (!bp) {
    user.batchProgress.push({ batchId: lecture.batchId, watchedLectures: [], lastAccessedAt: new Date() });
    bp = user.batchProgress[user.batchProgress.length - 1];
  }

  const lid = lecture._id.toString();
  const alreadyWatched = bp.watchedLectures.some((id) => id.toString() === lid);

  if (alreadyWatched) {
    bp.watchedLectures = bp.watchedLectures.filter((id) => id.toString() !== lid);
  } else {
    bp.watchedLectures.push(lecture._id);
    user.xp = (user.xp ?? 0) + 25;
  }
  bp.lastAccessedAt = new Date();

  await user.save();

  res.json({
    success: true,
    data: { completed: !alreadyWatched, watchedCount: bp.watchedLectures.length, xpGained: alreadyWatched ? 0 : 25 },
  });
});

// ── GET /api/batches/homework  ───────────────────────────────────────────────
// All homework across ALL enrolled batches for the logged-in student.

export const getAllHomework = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("batches homeworkProgress")
    .lean();

  if (!user.batches?.length) return res.json({ success: true, data: [] });

  const batches = await Batch.find({
    _id: { $in: user.batches },
    isActive: true,
  }).select("_id title slug").lean();

  if (!batches.length) return res.json({ success: true, data: [] });

  const batchIds = batches.map((b) => b._id);
  const batchMap = Object.fromEntries(batches.map((b) => [b._id.toString(), b]));

  const homework = await Homework.find({ batchId: { $in: batchIds } })
    .sort({ dueDate: 1 })
    .lean();

  const hwProgressMap = new Map(
    (user.homeworkProgress ?? []).map((p) => [p.homeworkId.toString(), p])
  );
  const now = new Date();

  const result = homework.map((h) => {
    const prog = hwProgressMap.get(h._id.toString());
    let status = prog?.status ?? "pending";
    if (status !== "completed" && new Date(h.dueDate) < now) status = "overdue";
    const batch = batchMap[h.batchId.toString()] ?? {};
    return {
      ...h,
      status,
      solvedCount: prog?.solvedCount ?? 0,
      completedAt: prog?.completedAt ?? null,
      batchTitle: batch.title ?? "",
      batchSlug: batch.slug ?? "",
    };
  });

  res.json({ success: true, data: result });
});

// ── GET /api/batches/:slug/homework  ──────────────────────────────────────────

export const getBatchHomework = asyncHandler(async (req, res) => {
  const batch = await Batch.findOne({ slug: req.params.slug }).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const isEnrolled = batch.enrolledStudents.some(
    (id) => id.toString() === req.user._id.toString()
  );
  if (!isEnrolled) { res.status(403); throw new Error("Not enrolled"); }

  const [homework, user] = await Promise.all([
    Homework.find({ batchId: batch._id }).sort({ dueDate: 1 }).lean(),
    User.findById(req.user._id).select("homeworkProgress").lean(),
  ]);

  const hwMap = new Map(
    (user.homeworkProgress ?? []).map((p) => [p.homeworkId.toString(), p])
  );
  const now = new Date();

  const result = homework.map((h) => {
    const prog = hwMap.get(h._id.toString());
    let status = prog?.status ?? "pending";
    if (status !== "completed" && new Date(h.dueDate) < now) status = "overdue";
    return { ...h, status, solvedCount: prog?.solvedCount ?? 0, completedAt: prog?.completedAt ?? null };
  });

  res.json({ success: true, data: result });
});

// ── POST /api/batches/:slug/homework/:hwId/progress  ──────────────────────────

export const updateHomeworkProgress = asyncHandler(async (req, res) => {
  const { status, solvedCount } = validateBody(homeworkProgressSchema, req.body);

  const homework = await Homework.findById(req.params.hwId).lean();
  if (!homework) { res.status(404); throw new Error("Homework not found"); }

  const user = await User.findById(req.user._id);
  user.homeworkProgress = user.homeworkProgress ?? [];

  const existing = user.homeworkProgress.find(
    (p) => p.homeworkId.toString() === req.params.hwId
  );

  if (existing) {
    const wasCompleted = existing.status === "completed";
    existing.status = status;
    if (solvedCount !== undefined) existing.solvedCount = solvedCount;
    if (status === "completed" && !wasCompleted) {
      existing.completedAt = new Date();
      user.xp = (user.xp ?? 0) + homework.xpReward;
    }
  } else {
    user.homeworkProgress.push({
      homeworkId: homework._id,
      status,
      solvedCount: solvedCount ?? 0,
      completedAt: status === "completed" ? new Date() : null,
    });
    if (status === "completed") user.xp = (user.xp ?? 0) + homework.xpReward;
  }

  await user.save();
  res.json({ success: true, data: { status, xpGained: status === "completed" ? homework.xpReward : 0 } });
});

// ── GET /api/batches/:slug/announcements  ─────────────────────────────────────

export const getBatchAnnouncements = asyncHandler(async (req, res) => {
  const batch = await Batch.findOne({ slug: req.params.slug }).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const isEnrolled = batch.enrolledStudents.some(
    (id) => id.toString() === req.user._id.toString()
  );
  if (!isEnrolled) { res.status(403); throw new Error("Not enrolled"); }

  const sorted = [...(batch.announcements ?? [])].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json({ success: true, data: sorted });
});
