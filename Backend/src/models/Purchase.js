import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseTier: {
      type: String,
      enum: ["FOUNDATION", "ACCELERATOR", "PLACEMENT"],
      required: true,
    },
    courseTitle: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
    couponCode: { type: String, default: "" },
    gstRate: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    paymentStatus: { type: String, enum: ["SUCCESS"], default: "SUCCESS" },
  },
  { timestamps: true }
);

purchaseSchema.index({ userId: 1, createdAt: -1 });

const Purchase = mongoose.models.Purchase ?? mongoose.model("Purchase", purchaseSchema);
export default Purchase;
