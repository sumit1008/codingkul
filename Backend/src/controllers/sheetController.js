import Sheet from "../models/Sheet.js";
import Topic from "../models/Topic.js";
import Problem from "../models/Problem.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET /api/sheets
export const getAllSheets = asyncHandler(async (req, res) => {
  const sheets = await Sheet.find().lean().sort({ createdAt: 1 });
  res.json({ success: true, data: sheets });
});

// GET /api/sheets/:slug
export const getSheetBySlug = asyncHandler(async (req, res) => {
  const sheet = await Sheet.findOne({ slug: req.params.slug }).lean();
  if (!sheet) {
    res.status(404);
    throw new Error("Sheet not found");
  }

  const topics = await Topic.find({ sheetSlug: req.params.slug })
    .lean()
    .sort({ order: 1 });

  res.json({ success: true, data: { ...sheet, topics } });
});

// GET /api/sheets/:slug/topics/:topicSlug/problems
export const getTopicProblems = asyncHandler(async (req, res) => {
  const { slug, topicSlug } = req.params;

  const topic = await Topic.findOne({ sheetSlug: slug, slug: topicSlug }).lean();
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const problems = await Problem.find({ sheetSlug: slug, topicSlug })
    .lean()
    .sort({ order: 1 });

  res.json({ success: true, data: problems });
});

// GET /api/problems/:id
export const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id).lean();
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  res.json({ success: true, data: problem });
});
