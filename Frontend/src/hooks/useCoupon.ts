"use client";

import { useCallback, useState } from "react";
import { couponApi } from "@/lib/api";
import type { CourseTier } from "@/types/course";
import type { CouponValidationResult } from "@/types/coupon";

export function useCoupon(tier: Exclude<CourseTier, "NONE">) {
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback(
    async (code: string) => {
      if (!code.trim()) return;
      setApplying(true);
      setError(null);
      try {
        const result = await couponApi.validate(code.trim(), tier);
        setAppliedCoupon(result);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setError(msg || "Invalid Coupon");
        setAppliedCoupon(null);
      } finally {
        setApplying(false);
      }
    },
    [tier]
  );

  const remove = useCallback(() => {
    setAppliedCoupon(null);
    setError(null);
  }, []);

  return { appliedCoupon, applying, error, apply, remove };
}
