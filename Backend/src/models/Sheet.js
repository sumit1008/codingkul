import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    isPremium: { type: Boolean, default: false },
    totalProblems: { type: Number, default: 0 },
    accentColor: { type: String, default: "#22d3ee" },
    accentFrom: { type: String, default: "#22d3ee" },
    accentTo: { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

export default mongoose.model("Sheet", sheetSchema);
