import mongoose, { Document, Schema } from "mongoose";

export interface ICouponRedemption extends Document {
  couponId: mongoose.Types.ObjectId;
  couponCode: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  courseTier: "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: "SUCCESS" | "FAILED";
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponRedemptionSchema = new Schema<ICouponRedemption>(
  {
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    couponCode: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    courseTier: { type: String, enum: ["FOUNDATION", "ACCELERATOR", "PLACEMENT"], required: true },
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    paymentStatus: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

CouponRedemptionSchema.index({ couponId: 1, createdAt: -1 });

export const CouponRedemption =
  mongoose.models.CouponRedemption ??
  mongoose.model<ICouponRedemption>("CouponRedemption", CouponRedemptionSchema);
