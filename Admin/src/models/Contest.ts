import mongoose, { Document, Schema } from "mongoose";

export interface IContest extends Document {
  title: string;
  slug: string;
  codeforcesContestId: number;
  codeforcesContestLink: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  xpReward: number;
  status: "upcoming" | "running" | "completed";
  processedResults: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContestSchema = new Schema<IContest>(
  {
    title:                { type: String, required: true, trim: true },
    slug:                 { type: String, unique: true, lowercase: true, trim: true },
    codeforcesContestId:  { type: Number, required: true, unique: true },
    codeforcesContestLink:{ type: String, required: true, trim: true },
    startTime:            { type: Date, required: true },
    endTime:              { type: Date, required: true },
    duration:             { type: String, required: true },
    difficulty:           { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    topics:               { type: [String], default: [] },
    xpReward:             { type: Number, default: 200, min: 0, max: 2000 },
    status:               { type: String, enum: ["upcoming", "running", "completed"], default: "upcoming" },
    processedResults:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContestSchema.index({ status: 1, startTime: 1 });

ContestSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export const Contest =
  mongoose.models.Contest ?? mongoose.model<IContest>("Contest", ContestSchema);
