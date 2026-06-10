import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAnyProduct } from "../middleware/requirePurchasedProduct.js";
import {
  getMyBatches,
  getBatchActivity,
  getAllHomework,
  getBatchBySlug,
  getBatchLectures,
  getLectureById,
  toggleLectureComplete,
  getBatchHomework,
  updateHomeworkProgress,
  getBatchAnnouncements,
} from "../controllers/batchController.js";

const router = express.Router();

// All batch routes require authentication AND at least one purchased product.
router.use(protect, requireAnyProduct);

// Summary routes (before /:slug to avoid conflicts)
router.get("/",          getMyBatches);
router.get("/activity",  getBatchActivity);
router.get("/homework",  getAllHomework);

// Batch detail
router.get("/:slug",                                      getBatchBySlug);
router.get("/:slug/lectures",                             getBatchLectures);
router.get("/:slug/lectures/:lectureId",                  getLectureById);
router.post("/:slug/lectures/:lectureId/complete",        toggleLectureComplete);
router.get("/:slug/homework",                             getBatchHomework);
router.post("/:slug/homework/:hwId/progress",             updateHomeworkProgress);
router.get("/:slug/announcements",                        getBatchAnnouncements);

export default router;
