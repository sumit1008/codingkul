import mongoose from "mongoose";
import Batch from "../models/Batch.js";
import Lecture from "../models/Lecture.js";
import Homework from "../models/Homework.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createBatchSchema, updateBatchSchema,
  createLectureSchema, updateLectureSchema,
  createHomeworkSchema, updateHomeworkSchema,
  announcementSchema, scheduleItemSchema,
  validateBody,
} from "../validations/batchValidation.js";

// ── Batches ───────────────────────────────────────────────────────────────────

export const listBatches = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q = "", isActive } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const [batches, total] = await Promise.all([
    Batch.find(filter).sort({ startDate: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean(),
    Batch.countDocuments(filter),
  ]);

  const batchIds = batches.map((b) => b._id);
  const [lecCounts, hwCounts] = await Promise.all([
    Lecture.aggregate([{ $match: { batchId: { $in: batchIds } } }, { $group: { _id: "$batchId", count: { $sum: 1 } } }]),
    Homework.aggregate([{ $match: { batchId: { $in: batchIds } } }, { $group: { _id: "$batchId", count: { $sum: 1 } } }]),
  ]);

  const lecMap = Object.fromEntries(lecCounts.map((l) => [l._id.toString(), l.count]));
  const hwMap  = Object.fromEntries(hwCounts.map((h) => [h._id.toString(), h.count]));

  const enriched = batches.map((b) => ({
    ...b,
    lectureCount:  lecMap[b._id.toString()]  ?? 0,
    homeworkCount: hwMap[b._id.toString()]   ?? 0,
    studentCount:  b.enrolledStudents?.length ?? 0,
  }));

  res.json({ success: true, data: { batches: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
});

export const createBatch = asyncHandler(async (req, res) => {
  const data = validateBody(createBatchSchema, req.body);

  const batch = await Batch.create({
    ...data,
    startDate: new Date(data.startDate),
    endDate:   new Date(data.endDate),
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: batch });
});

export const getBatch = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404); throw new Error("Batch not found"); }

  const batch = await Batch.findById(req.params.id).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const [lectures, homework] = await Promise.all([
    Lecture.find({ batchId: batch._id }).sort({ order: 1 }).lean(),
    Homework.find({ batchId: batch._id }).sort({ dueDate: 1 }).lean(),
  ]);

  res.json({ success: true, data: { batch, lectures, homework } });
});

export const updateBatch = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404); throw new Error("Batch not found"); }
  const data = validateBody(updateBatchSchema, req.body);

  const payload = { ...data };
  if (data.startDate) payload.startDate = new Date(data.startDate);
  if (data.endDate)   payload.endDate   = new Date(data.endDate);

  const updated = await Batch.findByIdAndUpdate(
    req.params.id, { $set: payload }, { new: true, runValidators: true }
  );
  if (!updated) { res.status(404); throw new Error("Batch not found"); }

  res.json({ success: true, data: updated });
});

export const deleteBatch = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404); throw new Error("Batch not found"); }

  const batch = await Batch.findById(req.params.id);
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  // Get all homework IDs before deleting so we can purge homeworkProgress from users
  const homeworkIds = await Homework.find({ batchId: req.params.id }).distinct("_id");

  await Promise.all([
    Batch.findByIdAndDelete(req.params.id),
    Lecture.deleteMany({ batchId: req.params.id }),
    Homework.deleteMany({ batchId: req.params.id }),
    User.updateMany(
      { batches: req.params.id },
      {
        $pull: {
          batches: new mongoose.Types.ObjectId(req.params.id),
          batchProgress: { batchId: new mongoose.Types.ObjectId(req.params.id) },
        },
      }
    ),
    homeworkIds.length > 0
      ? User.updateMany(
          { "homeworkProgress.homeworkId": { $in: homeworkIds } },
          { $pull: { homeworkProgress: { homeworkId: { $in: homeworkIds } } } }
        )
      : Promise.resolve(),
  ]);

  res.json({ success: true, message: "Batch and all associated data deleted" });
});

// ── Students ──────────────────────────────────────────────────────────────────

export const enrollStudents = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  if (!Array.isArray(userIds) || !userIds.length) {
    res.status(400); throw new Error("userIds array required");
  }

  const batch = await Batch.findById(req.params.id);
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const newStudents = userIds.filter(
    (uid) => !batch.enrolledStudents.some((e) => e.toString() === uid)
  );

  if (newStudents.length) {
    batch.enrolledStudents.push(...newStudents.map((id) => new mongoose.Types.ObjectId(id)));
    await batch.save();

    await User.updateMany(
      { _id: { $in: newStudents } },
      { $addToSet: { batches: batch._id } }
    );
  }

  res.json({ success: true, data: { enrolled: newStudents.length, total: batch.enrolledStudents.length } });
});

export const removeStudent = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  batch.enrolledStudents = batch.enrolledStudents.filter(
    (id) => id.toString() !== req.params.userId
  );
  await batch.save();

  await User.findByIdAndUpdate(req.params.userId, {
    $pull: { batches: batch._id },
  });

  res.json({ success: true, message: "Student removed" });
});

export const getStudents = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id).lean();
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const students = await User.find({ _id: { $in: batch.enrolledStudents } })
    .select("fullName username email avatar courseTier batchProgress homeworkProgress")
    .lean();

  res.json({ success: true, data: students });
});

// ── Announcements ─────────────────────────────────────────────────────────────

export const addAnnouncement = asyncHandler(async (req, res) => {
  const data = validateBody(announcementSchema, req.body);

  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { $push: { announcements: { ...data, createdAt: new Date() } } },
    { new: true }
  );
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const ann = batch.announcements[batch.announcements.length - 1];
  res.status(201).json({ success: true, data: ann });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const data = validateBody(announcementSchema.partial(), req.body);

  const batch = await Batch.findOneAndUpdate(
    { _id: req.params.id, "announcements._id": req.params.annId },
    {
      $set: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [`announcements.$.${k}`, v])
      ),
    },
    { new: true }
  );
  if (!batch) { res.status(404); throw new Error("Announcement not found"); }

  res.json({ success: true, data: batch.announcements.id(req.params.annId) });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { $pull: { announcements: { _id: req.params.annId } } },
    { new: true }
  );
  if (!batch) { res.status(404); throw new Error("Batch not found"); }
  res.json({ success: true, message: "Announcement deleted" });
});

// ── Schedule ──────────────────────────────────────────────────────────────────

export const addScheduleItem = asyncHandler(async (req, res) => {
  const data = validateBody(scheduleItemSchema, req.body);

  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { $push: { schedule: { ...data, liveAt: new Date(data.liveAt) } } },
    { new: true }
  );
  if (!batch) { res.status(404); throw new Error("Batch not found"); }

  const item = batch.schedule[batch.schedule.length - 1];
  res.status(201).json({ success: true, data: item });
});

export const markScheduleComplete = asyncHandler(async (req, res) => {
  const batch = await Batch.findOneAndUpdate(
    { _id: req.params.id, "schedule._id": req.params.schedId },
    { $set: { "schedule.$.isCompleted": true } },
    { new: true }
  );
  if (!batch) { res.status(404); throw new Error("Schedule item not found"); }
  res.json({ success: true, data: batch.schedule.id(req.params.schedId) });
});

// ── Lectures ──────────────────────────────────────────────────────────────────

export const listLectures = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404); throw new Error("Batch not found"); }
  const lectures = await Lecture.find({ batchId: req.params.id }).sort({ module: 1, order: 1 }).lean();
  res.json({ success: true, data: lectures });
});

export const createLecture = asyncHandler(async (req, res) => {
  const data = validateBody(createLectureSchema, req.body);

  const lecture = await Lecture.create({
    ...data,
    batchId:   new mongoose.Types.ObjectId(data.batchId),
    unlockAt:  data.unlockAt ? new Date(data.unlockAt) : undefined,
  });

  res.status(201).json({ success: true, data: lecture });
});

export const updateLecture = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.lectureId)) { res.status(404); throw new Error("Lecture not found"); }
  const data = validateBody(updateLectureSchema, req.body);

  const payload = { ...data };
  if (data.unlockAt) payload.unlockAt = new Date(data.unlockAt);

  const updated = await Lecture.findByIdAndUpdate(
    req.params.lectureId, { $set: payload }, { new: true, runValidators: true }
  );
  if (!updated) { res.status(404); throw new Error("Lecture not found"); }

  res.json({ success: true, data: updated });
});

export const deleteLecture = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.lectureId)) { res.status(404); throw new Error("Lecture not found"); }
  const deleted = await Lecture.findByIdAndDelete(req.params.lectureId);
  if (!deleted) { res.status(404); throw new Error("Lecture not found"); }
  res.json({ success: true, message: "Lecture deleted" });
});

// ── Homework ──────────────────────────────────────────────────────────────────

export const listHomework = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404); throw new Error("Batch not found"); }
  const homework = await Homework.find({ batchId: req.params.id }).sort({ dueDate: 1 }).lean();
  res.json({ success: true, data: homework });
});

export const createHomework = asyncHandler(async (req, res) => {
  const data = validateBody(createHomeworkSchema, req.body);

  const hw = await Homework.create({
    ...data,
    batchId:   new mongoose.Types.ObjectId(data.batchId),
    lectureId: data.lectureId ? new mongoose.Types.ObjectId(data.lectureId) : undefined,
    dueDate:   new Date(data.dueDate),
  });

  res.status(201).json({ success: true, data: hw });
});

export const updateHomework = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.hwId)) { res.status(404); throw new Error("Homework not found"); }
  const data = validateBody(updateHomeworkSchema, req.body);

  const payload = { ...data };
  if (data.dueDate) payload.dueDate = new Date(data.dueDate);
  if (data.lectureId) payload.lectureId = new mongoose.Types.ObjectId(data.lectureId);

  const updated = await Homework.findByIdAndUpdate(
    req.params.hwId, { $set: payload }, { new: true, runValidators: true }
  );
  if (!updated) { res.status(404); throw new Error("Homework not found"); }

  res.json({ success: true, data: updated });
});

export const deleteHomework = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.hwId)) { res.status(404); throw new Error("Homework not found"); }
  const deleted = await Homework.findByIdAndDelete(req.params.hwId);
  if (!deleted) { res.status(404); throw new Error("Homework not found"); }
  res.json({ success: true, message: "Homework deleted" });
});
