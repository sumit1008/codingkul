import mongoose, { Document, Schema } from "mongoose";

export interface ILecture extends Document {
  title: string;
  slug: string;
  batchId: mongoose.Types.ObjectId;
  module: string;
  description: string;
  youtubeVideoId: string;
  duration: number;
  order: number;
  attachments: { name: string; url: string }[];
  unlockAt?: Date;
  isLiveClassRecording: boolean;
  homeworkIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    url:  { type: String, required: true, trim: true },
  },
  { _id: false }
);

const LectureSchema = new Schema<ILecture>(
  {
    title:               { type: String, required: true, trim: true },
    slug:                { type: String, lowercase: true, trim: true },
    batchId:             { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    module:              { type: String, default: "General", trim: true },
    description:         { type: String, default: "" },
    youtubeVideoId:      { type: String, required: true, trim: true },
    duration:            { type: Number, default: 30, min: 1 },
    order:               { type: Number, default: 0 },
    attachments:         [attachmentSchema],
    unlockAt:            { type: Date },
    isLiveClassRecording:{ type: Boolean, default: false },
    homeworkIds:         [{ type: Schema.Types.ObjectId, ref: "Homework" }],
  },
  { timestamps: true }
);

LectureSchema.index({ batchId: 1, order: 1 });

LectureSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export const Lecture =
  mongoose.models.Lecture ?? mongoose.model<ILecture>("Lecture", LectureSchema);
