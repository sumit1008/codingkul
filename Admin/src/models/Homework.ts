import mongoose, { Document, Schema } from "mongoose";

export interface IHomework extends Document {
  title: string;
  description: string;
  batchId: mongoose.Types.ObjectId;
  lectureId?: mongoose.Types.ObjectId;
  dueDate: Date;
  problems: {
    title: string;
    platform: "LeetCode" | "Codeforces" | "GeeksforGeeks" | "CodingNinjas" | "AtCoder" | "Other";
    link: string;
    tags: string[];
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema(
  {
    title:      { type: String, required: true, trim: true },
    platform:   { type: String, enum: ["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"], default: "LeetCode" },
    link:       { type: String, default: "" },
    tags:       { type: [String], default: [] },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  },
  { _id: true }
);

const HomeworkSchema = new Schema<IHomework>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    batchId:     { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    lectureId:   { type: Schema.Types.ObjectId, ref: "Lecture" },
    dueDate:     { type: Date, required: true },
    problems:    [problemSchema],
    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    xpReward:    { type: Number, default: 50, min: 0, max: 1000 },
    isMandatory: { type: Boolean, default: false },
  },
  { timestamps: true }
);

HomeworkSchema.index({ batchId: 1, dueDate: 1 });

export const Homework =
  mongoose.models.Homework ?? mongoose.model<IHomework>("Homework", HomeworkSchema);
