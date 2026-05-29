import mongoose from "mongoose";

const scheduleItemSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  liveAt:          { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  meetLink:        { type: String, default: "" },
  lectureId:       { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
  isCompleted:     { type: Boolean, default: false },
});

const announcementSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  isPinned:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const batchSchema = new mongoose.Schema(
  {
    title:            { type: String, required: [true, "Title is required"], trim: true },
    slug:             { type: String, unique: true, lowercase: true, trim: true },
    description:      { type: String, default: "" },
    courseId:         { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    instructorName:   { type: String, required: [true, "Instructor name is required"], trim: true },
    meetLink:         { type: String, default: "" },
    bannerImage:      { type: String, default: "" },
    startDate:        { type: Date, required: [true, "Start date is required"] },
    endDate:          { type: Date, required: [true, "End date is required"] },
    isActive:         { type: Boolean, default: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    schedule:         [scheduleItemSchema],
    announcements:    [announcementSchema],
    createdBy:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

batchSchema.index({ courseId: 1 });
batchSchema.index({ isActive: 1, startDate: 1 });

batchSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
