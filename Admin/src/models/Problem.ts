import mongoose, { Document, Schema, Types } from "mongoose";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform =
  | "LeetCode"
  | "Codeforces"
  | "GeeksforGeeks"
  | "CodingNinjas"
  | "AtCoder"
  | "Other";

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  subtopic: string;
  platform: Platform;
  problemUrl: string;
  editorialUrl: string;
  videoUrl: string;
  notes: string;
  tags: string[];
  companies: string[];
  order: number;
  sheetId: Types.ObjectId | null;
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    difficulty:   { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topic:        { type: String, required: true, trim: true },
    subtopic:     { type: String, default: "" },
    platform:     {
      type: String,
      enum: ["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"],
      default: "LeetCode",
    },
    problemUrl:   { type: String, default: "" },
    editorialUrl: { type: String, default: "" },
    videoUrl:     { type: String, default: "" },
    notes:        { type: String, default: "" },
    tags:         [{ type: String, trim: true }],
    companies:    [{ type: String, trim: true }],
    order:        { type: Number, default: 0 },
    sheetId:      { type: Schema.Types.ObjectId, ref: "Sheet", default: null },
    isSolved:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProblemSchema.index({ sheetId: 1, order: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ topic: 1 });
ProblemSchema.index({ slug: 1 });

export const Problem =
  mongoose.models.Problem ?? mongoose.model<IProblem>("Problem", ProblemSchema);
