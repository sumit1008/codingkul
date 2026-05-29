import mongoose, { Document, Schema } from "mongoose";

export interface IBatch extends Document {
  title: string;
  slug: string;
  description: string;
  courseId?: mongoose.Types.ObjectId;
  instructorName: string;
  meetLink?: string;
  bannerImage?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  enrolledStudents: mongoose.Types.ObjectId[];
  schedule: {
    title: string;
    liveAt: Date;
    durationMinutes: number;
    meetLink?: string;
    lectureId?: mongoose.Types.ObjectId;
    isCompleted: boolean;
  }[];
  announcements: {
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: Date;
  }[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleItemSchema = new Schema(
  {
    title:           { type: String, required: true, trim: true },
    liveAt:          { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetLink:        { type: String, default: "" },
    lectureId:       { type: Schema.Types.ObjectId, ref: "Lecture" },
    isCompleted:     { type: Boolean, default: false },
  },
  { _id: true }
);

const announcementSchema = new Schema(
  {
    title:     { type: String, required: true, trim: true },
    content:   { type: String, required: true },
    isPinned:  { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const BatchSchema = new Schema<IBatch>(
  {
    title:            { type: String, required: true, trim: true },
    slug:             { type: String, unique: true, lowercase: true, trim: true },
    description:      { type: String, default: "" },
    courseId:         { type: Schema.Types.ObjectId, ref: "Course" },
    instructorName:   { type: String, required: true, trim: true },
    meetLink:         { type: String, default: "" },
    bannerImage:      { type: String, default: "" },
    startDate:        { type: Date, required: true },
    endDate:          { type: Date, required: true },
    isActive:         { type: Boolean, default: true },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    schedule:         [scheduleItemSchema],
    announcements:    [announcementSchema],
    createdBy:        { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

BatchSchema.index({ isActive: 1 });

BatchSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export const Batch =
  mongoose.models.Batch ?? mongoose.model<IBatch>("Batch", BatchSchema);
