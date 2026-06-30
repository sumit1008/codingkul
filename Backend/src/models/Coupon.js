import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, default: "", trim: true },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    applicableCourses: {
      type: [{ type: String, enum: ["FOUNDATION", "ACCELERATOR", "PLACEMENT"] }],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one applicable course is required",
      },
    },
    validityDays: { type: Number, required: true, min: 1 },
    expiresAt: { type: Date, required: true },
    maxUsageCount: { type: Number, required: true, min: 1 },
    usageCount: { type: Number, default: 0, min: 0 },
    isDisabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdByName: { type: String, default: "" },
    createdByEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

couponSchema.index({ isDeleted: 1, isDisabled: 1, expiresAt: 1 });
couponSchema.index({ applicableCourses: 1 });

couponSchema.pre("validate", function (next) {
  if (this.isModified("validityDays") || this.isNew) {
    const createdAt = this.isNew ? new Date() : this.createdAt;
    this.expiresAt = new Date(createdAt.getTime() + this.validityDays * 24 * 60 * 60 * 1000);
  }
  next();
});

const Coupon = mongoose.models.Coupon ?? mongoose.model("Coupon", couponSchema);
export default Coupon;
