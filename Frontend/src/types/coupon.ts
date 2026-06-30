export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
}
