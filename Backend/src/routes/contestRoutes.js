import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUpcomingContests,
  getPreviousContests,
  getContestById,
  getLeaderboard,
  getUserAnalytics,
  getUserPerformance,
  linkCodeforcesHandle,
} from "../controllers/contestController.js";

const router = Router();

// Named public routes — must be declared BEFORE /:id wildcard
router.get("/upcoming",     getUpcomingContests);
router.get("/leaderboard",  getLeaderboard);

// Semi-public: previous contests (unauthenticated gets all; authenticated also gets user results)
router.get("/previous",     getPreviousContests);

// Authenticated routes
router.get("/analytics",    protect, getUserAnalytics);
router.get("/performance",  protect, getUserPerformance);
router.patch("/cf-handle",  protect, linkCodeforcesHandle);

// Wildcard — must be last
router.get("/:id",          getContestById);

export default router;
