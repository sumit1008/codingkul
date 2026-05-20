import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    problemLink: { type: String, required: true },
    platform: { type: String, default: "LeetCode" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", ""],
      default: "",
    },
    tags: [{ type: String }],
    sheetSlug: { type: String, required: true, index: true },
    topicSlug: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
    xp: { type: Number, default: 50 },
    isPremium: { type: Boolean, default: false },
    resourceType: { type: String, enum: ["Problem", "Article", ""], default: "Problem" },
    pattern: { type: String, default: "" },
    subpattern: { type: String, default: "" },
    priority: { type: String, default: "" },
    subtopic: { type: String, default: "" },
  },
  { timestamps: true }
);

// Unique per sheet+topic+link; allows same problem to appear in same-named topics across different sheets
problemSchema.index({ sheetSlug: 1, topicSlug: 1, problemLink: 1 }, { unique: true });
problemSchema.index({ sheetSlug: 1, topicSlug: 1, order: 1 });

export default mongoose.model("Problem", problemSchema);
