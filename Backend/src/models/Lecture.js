import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url:  { type: String, required: true },
});

const lectureSchema = new mongoose.Schema(
  {
    title:                { type: String, required: [true, "Title is required"], trim: true },
    slug:                 { type: String, lowercase: true, trim: true },
    batchId:              { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    module:               { type: String, default: "General", trim: true },
    description:          { type: String, default: "" },
    youtubeVideoId:       { type: String, required: [true, "YouTube video ID is required"], trim: true },
    duration:             { type: Number, default: 0 },
    order:                { type: Number, default: 0 },
    attachments:          [attachmentSchema],
    unlockAt:             { type: Date },
    isLiveClassRecording: { type: Boolean, default: false },
    homeworkIds:          [{ type: mongoose.Schema.Types.ObjectId, ref: "Homework" }],
  },
  { timestamps: true }
);

lectureSchema.index({ slug: 1 }, { unique: true, sparse: true });
lectureSchema.index({ batchId: 1, order: 1 });

lectureSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
