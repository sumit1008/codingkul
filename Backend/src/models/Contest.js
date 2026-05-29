import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    codeforcesContestId: {
      type: Number,
      required: [true, "Codeforces contest ID is required"],
    },
    codeforcesContestLink: {
      type: String,
      required: [true, "Codeforces contest link is required"],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"], // e.g. "2 hours"
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Difficulty is required"],
    },
    topics: {
      type: [String],
      default: [],
    },
    xpReward: {
      type: Number,
      default: 200,
      min: 0,
      max: 2000,
    },
    status: {
      type: String,
      enum: ["upcoming", "running", "completed"],
      default: "upcoming",
    },
    processedResults: {
      type: Boolean,
      default: false,
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "retry_pending"],
      default: "pending",
    },
    processingFailures: {
      type: Number,
      default: 0,
    },
    processingFailedReason: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

contestSchema.index({ slug: 1 }, { unique: true, sparse: true });
contestSchema.index({ status: 1, startTime: 1 });
contestSchema.index({ codeforcesContestId: 1 }, { unique: true });

// Auto-generate slug from title on first save
contestSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Contest = mongoose.model("Contest", contestSchema);
export default Contest;
