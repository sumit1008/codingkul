import express from "express";
import { getProblemById } from "../controllers/sheetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getProblemById);

export default router;
