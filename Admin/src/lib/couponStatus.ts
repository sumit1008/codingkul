import type { ICoupon } from "@/models/Coupon";

export type CouponStatus = "ACTIVE" | "DISABLED" | "EXPIRED" | "DELETED";

export function getCouponStatus(coupon: Pick<ICoupon, "isDeleted" | "usageCount" | "maxUsageCount" | "expiresAt" | "isDisabled">): CouponStatus {
  if (coupon.isDeleted) return "DELETED";
  if (coupon.usageCount >= coupon.maxUsageCount) return "EXPIRED";
  if (new Date() > new Date(coupon.expiresAt)) return "EXPIRED";
  if (coupon.isDisabled) return "DISABLED";
  return "ACTIVE";
}

export function expiryReason(coupon: Pick<ICoupon, "usageCount" | "maxUsageCount" | "expiresAt">): string {
  if (coupon.usageCount >= coupon.maxUsageCount) return "Maximum usage reached";
  if (new Date() > new Date(coupon.expiresAt)) return "Expiry date reached";
  return "";
}

export function daysRemaining(expiresAt: Date | string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}
