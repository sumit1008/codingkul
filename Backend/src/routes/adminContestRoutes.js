import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  listContests,
  createContest,
  updateContest,
  deleteContest,
  triggerProcessing,
  updateContestStatus,
} from "../controllers/adminContestController.js";

const router = Router();

// All admin routes require both auth + admin role
router.use(protect, adminOnly);

router.get("/",                      listContests);
router.post("/create",               createContest);
router.put("/update/:id",            updateContest);
router.delete("/delete/:id",         deleteContest);
router.post("/:id/process",          triggerProcessing);
router.patch("/:id/status",          updateContestStatus);

export default router;
