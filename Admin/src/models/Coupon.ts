import mongoose, { Document, Schema } from "mongoose";

export type CouponCourse = "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";
export type CouponDiscountType = "PERCENTAGE" | "FIXED";

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  applicableCourses: CouponCourse[];
  validityDays: number;
  expiresAt: Date;
  maxUsageCount: number;
  usageCount: number;
  isDisabled: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  createdByName: string;
  createdByEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, default: "", trim: true },
    discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    applicableCourses: {
      type: [{ type: String, enum: ["FOUNDATION", "ACCELERATOR", "PLACEMENT"] }],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
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
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    createdByName: { type: String, default: "" },
    createdByEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

CouponSchema.index({ isDeleted: 1, isDisabled: 1, expiresAt: 1 });
CouponSchema.index({ applicableCourses: 1 });

CouponSchema.pre("validate", function (next) {
  if (this.isModified("validityDays") || this.isNew) {
    const createdAt = this.isNew ? new Date() : this.createdAt;
    this.expiresAt = new Date(createdAt.getTime() + this.validityDays * 24 * 60 * 60 * 1000);
  }
  next();
});

export const Coupon =
  mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", CouponSchema);
