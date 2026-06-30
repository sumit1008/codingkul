import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import CouponRedemption from "../models/CouponRedemption.js";
import Purchase from "../models/Purchase.js";
import { nextSequence } from "../models/Counter.js";
import { TIER_LEVELS, COURSE_PRICES, calculateUpgradePrice } from "../utils/courseAccess.js";
import { validateCouponForPurchase, tryIncrementUsage } from "../services/couponService.js";
import { COURSES } from "../data/courses.js";
import asyncHandler from "../middleware/asyncHandler.js";

async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const seq = await nextSequence(`invoice-${year}`);
  return `AK-${year}-${String(seq).padStart(6, "0")}`;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/validate-coupon
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, tier } = req.body;

  if (!tier || !COURSE_PRICES[tier]) {
    res.status(400);
    throw new Error("Invalid tier");
  }

  try {
    const result = await validateCouponForPurchase({
      code,
      tier,
      currentTier: req.user.courseTier,
    });

    res.json({
      success: true,
      data: {
        valid: true,
        code: result.coupon.code,
        discountType: result.discountType,
        discountValue: result.discountValue,
        originalPrice: result.originalPrice,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 400);
    throw err;
  }
});

// POST /api/payment/create-order
export const createOrder = asyncHandler(async (req, res) => {
  const { tier, couponCode } = req.body;

  if (!tier || !COURSE_PRICES[tier]) {
    res.status(400);
    throw new Error("Invalid tier");
  }

  const userTierLevel = TIER_LEVELS[req.user.courseTier] ?? 0;
  const targetTierLevel = TIER_LEVELS[tier] ?? 0;

  if (userTierLevel >= targetTierLevel) {
    res.status(400);
    throw new Error("You already have access to this tier or higher");
  }

  let finalAmount;
  let originalPrice;
  let discountAmount = 0;
  let orderNotes = {
    userId: req.user._id.toString(),
    targetTier: tier,
    currentTier: req.user.courseTier,
  };

  if (couponCode) {
    try {
      const result = await validateCouponForPurchase({
        code: couponCode,
        tier,
        currentTier: req.user.courseTier,
      });
      finalAmount = result.finalAmount;
      originalPrice = result.originalPrice;
      discountAmount = result.discountAmount;
      orderNotes = {
        ...orderNotes,
        couponId: result.coupon._id.toString(),
        couponCode: result.coupon.code,
      };
    } catch (err) {
      res.status(err.statusCode || 400);
      throw err;
    }
  } else {
    finalAmount = calculateUpgradePrice(req.user.courseTier, tier);
    originalPrice = finalAmount;
    if (!finalAmount || finalAmount < 1) {
      res.status(400);
      throw new Error("Invalid upgrade price");
    }
  }

  orderNotes = {
    ...orderNotes,
    originalPrice: String(originalPrice),
    discountAmount: String(discountAmount),
    finalAmount: String(finalAmount),
  };

  const amountInPaise = finalAmount * 100;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${req.user._id}_${tier}_${Date.now()}`.slice(0, 40),
    notes: orderNotes,
  });

  res.json({
    success: true,
    data: {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
  });
});

// POST /api/payment/verify
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment details");
  }

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — signature mismatch");
  }

  // Re-fetch the order from Razorpay so tier/coupon/amount come from
  // server-stored notes, never from the client-supplied request body.
  const order = await razorpay.orders.fetch(razorpay_order_id);
  const notes = order.notes || {};

  if (notes.userId !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Order does not belong to this user");
  }

  const tier = notes.targetTier;
  if (!tier || !COURSE_PRICES[tier]) {
    res.status(400);
    throw new Error("Invalid order — missing tier");
  }

  const userTierLevel = TIER_LEVELS[req.user.courseTier] ?? 0;
  const targetTierLevel = TIER_LEVELS[tier] ?? 0;

  if (userTierLevel >= targetTierLevel) {
    return res.json({
      success: true,
      data: { message: "Already at this tier or higher", courseTier: req.user.courseTier },
    });
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      courseTier: tier,
      $addToSet: { purchasedCourses: tier.toLowerCase() },
    },
    { new: true }
  ).select("-password");

  if (notes.couponId) {
    const alreadyRedeemed = await CouponRedemption.findOne({ razorpayOrderId: razorpay_order_id });

    if (!alreadyRedeemed) {
      const reserved = await tryIncrementUsage(notes.couponId);

      await CouponRedemption.create({
        couponId: notes.couponId,
        couponCode: notes.couponCode,
        userId: req.user._id,
        userName: req.user.fullName,
        userEmail: req.user.email,
        courseTier: tier,
        originalPrice: Number(notes.originalPrice),
        discountAmount: Number(notes.discountAmount),
        finalAmount: Number(notes.finalAmount),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "SUCCESS",
        note: reserved ? "" : "granted past cap — race condition",
      });
    }
  }

  const alreadyRecorded = await Purchase.findOne({ razorpayOrderId: razorpay_order_id });
  if (!alreadyRecorded) {
    const courseTitle = COURSES.find((c) => c.tier === tier)?.title || tier;
    const invoiceNumber = await generateInvoiceNumber();

    await Purchase.create({
      userId: req.user._id,
      courseTier: tier,
      courseTitle,
      originalPrice: Number(notes.originalPrice),
      discountAmount: Number(notes.discountAmount),
      finalAmount: Number(notes.finalAmount),
      couponId: notes.couponId || null,
      couponCode: notes.couponCode || "",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      invoiceNumber,
      paymentStatus: "SUCCESS",
    });
  }

  res.json({
    success: true,
    data: {
      message: "Payment verified — tier upgraded",
      courseTier: updated.courseTier,
    },
  });
});
