import express from "express";
import {
  getAllSheets,
  getSheetBySlug,
  getTopicProblems,
  getProblemById,
} from "../controllers/sheetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllSheets);
router.get("/:slug", protect, getSheetBySlug);
router.get("/:slug/topics/:topicSlug/problems", protect, getTopicProblems);

export default router;
