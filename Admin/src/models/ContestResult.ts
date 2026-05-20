import mongoose, { Document, Schema } from "mongoose";

export interface IContestResult extends Document {
  userId: mongoose.Types.ObjectId;
  contestId: mongoose.Types.ObjectId;
  cfHandle: string;
  globalRank: number;
  solved: number;
  penalty: number;
  ratingChange: number;
  xpEarned: number;
  academyRatingAfter: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContestResultSchema = new Schema<IContestResult>(
  {
    userId:             { type: Schema.Types.ObjectId, ref: "User", required: true },
    contestId:          { type: Schema.Types.ObjectId, ref: "Contest", required: true },
    cfHandle:           { type: String, required: true, trim: true },
    globalRank:         { type: Number, required: true, min: 1 },
    solved:             { type: Number, default: 0, min: 0 },
    penalty:            { type: Number, default: 0, min: 0 },
    ratingChange:       { type: Number, default: 0 },
    xpEarned:           { type: Number, default: 0, min: 0 },
    academyRatingAfter: { type: Number, required: true, min: 800 },
  },
  { timestamps: true }
);

ContestResultSchema.index({ userId: 1, contestId: 1 }, { unique: true });
ContestResultSchema.index({ contestId: 1, globalRank: 1 });

export const ContestResult =
  mongoose.models.ContestResult ??
  mongoose.model<IContestResult>("ContestResult", ContestResultSchema);
