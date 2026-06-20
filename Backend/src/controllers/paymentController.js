import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import { TIER_LEVELS, COURSE_PRICES, calculateUpgradePrice } from "../utils/courseAccess.js";
import asyncHandler from "../middleware/asyncHandler.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
export const createOrder = asyncHandler(async (req, res) => {
  const { tier } = req.body;

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

  const upgradePrice = calculateUpgradePrice(req.user.courseTier, tier);

  if (!upgradePrice || upgradePrice < 1) {
    res.status(400);
    throw new Error("Invalid upgrade price");
  }

  const amountInPaise = upgradePrice * 100;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${req.user._id}_${tier}_${Date.now()}`.slice(0, 40),
    notes: {
      userId: req.user._id.toString(),
      targetTier: tier,
      currentTier: req.user.courseTier,
    },
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
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, tier } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !tier) {
    res.status(400);
    throw new Error("Missing payment details");
  }

  if (!COURSE_PRICES[tier]) {
    res.status(400);
    throw new Error("Invalid tier");
  }

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — signature mismatch");
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

  res.json({
    success: true,
    data: {
      message: "Payment verified — tier upgraded",
      courseTier: updated.courseTier,
    },
  });
});
