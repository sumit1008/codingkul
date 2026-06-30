import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: function () {
        return this.fullName ? this.fullName.slice(0, 2).toUpperCase() : "U";
      },
    },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    courseTier: {
      type: String,
      enum: ["NONE", "FOUNDATION", "ACCELERATOR", "PLACEMENT"],
      default: "NONE",
    },
    purchasedCourses: [{ type: String }],

    // ── Contest / competitive fields (added in S4) ──────────────────
    codeforcesHandle: {
      type: String,
      trim: true,
      default: "",
      sparse: true,
    },
    academyRating: {
      type: Number,
      default: 1200,
      min: 800,
    },
    academyRankTitle: {
      type: String,
      default: "Pupil",
    },
    contestXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    contestsParticipated: {
      type: Number,
      default: 0,
      min: 0,
    },
    contestBestRank: {
      type: Number,
      default: null,
    },
    contestHistory: [
      {
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest" },
        contestTitle: { type: String },
        rank: { type: Number },
        solved: { type: Number },
        ratingChange: { type: Number },
        xpEarned: { type: Number },
        ratingAfter: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],

    // ── Batch / Learning fields (added in S5) ──────────────────────────
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
    batchProgress: [
      {
        batchId:         { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
        watchedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
        lastAccessedAt:  { type: Date, default: Date.now },
        xpEarned:        { type: Number, default: 0 },
      },
    ],
    homeworkProgress: [
      {
        homeworkId:  { type: mongoose.Schema.Types.ObjectId, ref: "Homework" },
        status:      { type: String, enum: ["pending", "in-progress", "completed", "overdue"], default: "pending" },
        solvedCount: { type: Number, default: 0 },
        completedAt: { type: Date },
      },
    ],

    // ── Progress tracking fields ───────────────────────────────────────────────
    problemsSolved: { type: Number, default: 0, min: 0 },
    activityLog: [
      {
        date:  { type: String }, // "YYYY-MM-DD"
        count: { type: Number, default: 1 },
      },
    ],

    // ── Student profile (added in S8) ───────────────────────────────────────────
    // Codeforces username intentionally lives at the top level (codeforcesHandle) —
    // not duplicated here — since the contest system already reads/writes it.
    profile: {
      personal: {
        mobileNumber:   { type: String, trim: true, default: "" },
        dateOfBirth:    { type: Date, default: null },
        gender:         { type: String, enum: ["male", "female", "other", ""], default: "" },
        parentName:     { type: String, trim: true, default: "" },
        parentContact:  { type: String, trim: true, default: "" },
        avatarPresetId: { type: Number, min: 1, max: 12, default: () => 1 + Math.floor(Math.random() * 12) },
      },
      academic: {
        collegeName:     { type: String, trim: true, default: "" },
        university:      { type: String, trim: true, default: "" },
        degree:          { type: String, trim: true, default: "" },
        branch:          { type: String, trim: true, default: "" },
        currentYear:     { type: String, trim: true, default: "" },
        graduationYear:  { type: Number, default: null },
      },
      career: {
        resumeUrl:         { type: String, trim: true, default: "" },
        targetRole:        { type: String, trim: true, default: "" },
        preferredLocation: { type: String, trim: true, default: "" },
        currentCompany:    { type: String, trim: true, default: "" },
        currentPackage:    { type: String, trim: true, default: "" },
        targetPackage:     { type: String, trim: true, default: "" },
      },
      codingProfiles: {
        leetcodeUsername: { type: String, trim: true, default: "" },
        codechefUsername: { type: String, trim: true, default: "" },
        gfgUsername:      { type: String, trim: true, default: "" },
        githubUsername:   { type: String, trim: true, default: "" },
        linkedinUrl:      { type: String, trim: true, default: "" },
        portfolioUrl:     { type: String, trim: true, default: "" },
      },
      address: {
        addressLine: { type: String, trim: true, default: "" },
        city:        { type: String, trim: true, default: "" },
        state:       { type: String, trim: true, default: "" },
        country:     { type: String, trim: true, default: "" },
        pinCode:     { type: String, trim: true, default: "" },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
