import mongoose from "mongoose";

const contestResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    cfHandle: {
      type: String,
      required: true,
      trim: true,
    },
    globalRank: {
      type: Number,
      required: true,
      min: 1,
    },
    solved: {
      type: Number,
      default: 0,
      min: 0,
    },
    penalty: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratingChange: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    academyRatingAfter: {
      type: Number,
      required: true,
      min: 800,
    },
  },
  { timestamps: true }
);

// One result per user per contest
contestResultSchema.index({ userId: 1, contestId: 1 }, { unique: true });
contestResultSchema.index({ contestId: 1, globalRank: 1 });

const ContestResult = mongoose.model("ContestResult", contestResultSchema);
export default ContestResult;
