import mongoose from "mongoose";

const couponRedemptionSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    couponCode: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    courseTier: {
      type: String,
      enum: ["FOUNDATION", "ACCELERATOR", "PLACEMENT"],
      required: true,
    },
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

couponRedemptionSchema.index({ couponId: 1, createdAt: -1 });

const CouponRedemption =
  mongoose.models.CouponRedemption ?? mongoose.model("CouponRedemption", couponRedemptionSchema);
export default CouponRedemption;
