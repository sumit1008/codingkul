import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    sheetSlug: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
    totalProblems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

topicSchema.index({ sheetSlug: 1, slug: 1 }, { unique: true });

export default mongoose.model("Topic", topicSchema);
