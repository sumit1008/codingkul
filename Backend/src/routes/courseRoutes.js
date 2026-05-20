import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllCourses, getCourseBySlug } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", protect, getAllCourses);
router.get("/:slug", protect, getCourseBySlug);

export default router;
