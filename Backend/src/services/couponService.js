import Coupon from "../models/Coupon.js";
import { calculateUpgradePrice } from "../utils/courseAccess.js";

export function getCouponStatus(coupon) {
  if (coupon.isDeleted) return "DELETED";
  if (coupon.usageCount >= coupon.maxUsageCount) return "EXPIRED";
  if (new Date() > coupon.expiresAt) return "EXPIRED";
  if (coupon.isDisabled) return "DISABLED";
  return "ACTIVE";
}

export function computeDiscount(basePrice, coupon) {
  const rawDiscount =
    coupon.discountType === "PERCENTAGE"
      ? Math.round((basePrice * coupon.discountValue) / 100)
      : coupon.discountValue;

  const discountAmount = Math.min(rawDiscount, basePrice - 1);
  const finalAmount = Math.max(1, basePrice - discountAmount);
  return { discountAmount, finalAmount };
}

/**
 * Validates a coupon for a given user/tier purchase. Throws an Error whose
 * message is one of the exact user-facing strings the checkout UI expects.
 * Never trusts a discount value supplied by the caller — always recomputed here.
 */
export async function validateCouponForPurchase({ code, tier, currentTier }) {
  if (!code || typeof code !== "string") {
    const err = new Error("Invalid Coupon");
    err.statusCode = 400;
    throw err;
  }

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isDeleted: false });
  if (!coupon) {
    const err = new Error("Invalid Coupon");
    err.statusCode = 400;
    throw err;
  }

  const status = getCouponStatus(coupon);
  if (status === "EXPIRED") {
    const err = new Error(
      coupon.usageCount >= coupon.maxUsageCount ? "Coupon Usage Limit Reached" : "Coupon Expired"
    );
    err.statusCode = 400;
    throw err;
  }
  if (status === "DISABLED") {
    const err = new Error("Coupon Disabled");
    err.statusCode = 400;
    throw err;
  }
  if (!coupon.applicableCourses.includes(tier)) {
    const err = new Error("Coupon Not Applicable For This Course");
    err.statusCode = 400;
    throw err;
  }

  const basePrice = calculateUpgradePrice(currentTier, tier);
  if (!basePrice || basePrice < 1) {
    const err = new Error("Invalid upgrade price");
    err.statusCode = 400;
    throw err;
  }

  const { discountAmount, finalAmount } = computeDiscount(basePrice, coupon);

  return {
    coupon,
    originalPrice: basePrice,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    finalAmount,
  };
}

/**
 * Atomically increments usage count, guarding against the cap being reached
 * concurrently. Returns true if the increment succeeded (slot reserved),
 * false if the cap was already hit by a concurrent redemption.
 */
export async function tryIncrementUsage(couponId) {
  const updated = await Coupon.findOneAndUpdate(
    {
      _id: couponId,
      isDisabled: false,
      isDeleted: false,
      expiresAt: { $gt: new Date() },
      $expr: { $lt: ["$usageCount", "$maxUsageCount"] },
    },
    { $inc: { usageCount: 1 } },
    { new: true }
  );
  return Boolean(updated);
}
