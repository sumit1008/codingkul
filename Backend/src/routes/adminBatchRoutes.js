import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  listBatches, createBatch, getBatch, updateBatch, deleteBatch,
  enrollStudents, removeStudent, getStudents,
  addAnnouncement, updateAnnouncement, deleteAnnouncement,
  addScheduleItem, markScheduleComplete,
  listLectures, createLecture, updateLecture, deleteLecture,
  listHomework, createHomework, updateHomework, deleteHomework,
} from "../controllers/adminBatchController.js";

const router = express.Router();

router.use(protect, adminOnly);

// Batches CRUD
router.get("/",    listBatches);
router.post("/",   createBatch);
router.get("/:id", getBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

// Students
router.get("/:id/students",               getStudents);
router.post("/:id/students",              enrollStudents);
router.delete("/:id/students/:userId",    removeStudent);

// Announcements
router.post("/:id/announcements",                         addAnnouncement);
router.put("/:id/announcements/:annId",                   updateAnnouncement);
router.delete("/:id/announcements/:annId",                deleteAnnouncement);

// Schedule
router.post("/:id/schedule",                              addScheduleItem);
router.patch("/:id/schedule/:schedId/complete",           markScheduleComplete);

// Lectures
router.get("/:id/lectures",               listLectures);
router.post("/:id/lectures",              createLecture);
router.put("/:id/lectures/:lectureId",    updateLecture);
router.delete("/:id/lectures/:lectureId", deleteLecture);

// Homework
router.get("/:id/homework",         listHomework);
router.post("/:id/homework",        createHomework);
router.put("/:id/homework/:hwId",   updateHomework);
router.delete("/:id/homework/:hwId",deleteHomework);

export default router;
