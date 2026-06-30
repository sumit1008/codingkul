"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, ArrowRight, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Course, CourseTier, COURSE_PRICES } from "@/types/course";
import { useAuth } from "@/lib/auth-context";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useCoupon } from "@/hooks/useCoupon";
import CouponInput from "./CouponInput";

const TIER_LABELS: Record<CourseTier, string> = {
  NONE: "Free Plan",
  FOUNDATION: "Foundation Program",
  ACCELERATOR: "Accelerator Program",
  PLACEMENT: "Placement Mastery Program",
};

const UPGRADE_HIGHLIGHTS: Record<string, string[]> = {
  foundation: [
    "Regular Live DSA Classes",
    "250+ Hours Content",
    "Complete DSA Sheet",
    "Weekly Assignments",
    "Structured Learning Roadmap",
  ],
  accelerator: [
    "Everything in Foundation",
    "Ranked Contests + Mentor",
    "Homework Discussion Classes",
    "Problem Solving Marathons",
    "Monthly 1-on-1 Reviews",
  ],
  placement: [
    "Everything in Accelerator",
    "OS, DBMS, CN, OOPs Classes",
    "Mock Interviews",
    "Resume & LinkedIn Optimization",
    "OffCampus Jobs Group Access",
  ],
};

const SLUG_COLORS: Record<string, { border: string; btn: string; badge: string; glow: string; gradFrom: string; accent: string }> = {
  foundation: {
    border: "rgba(34,197,94,0.35)",
    btn: "linear-gradient(135deg, #15803d, #16a34a)",
    badge: "#22c55e",
    glow: "rgba(34,197,94,0.08)",
    gradFrom: "rgba(34,197,94,0.06)",
    accent: "#16a34a",
  },
  accelerator: {
    border: "rgba(234,179,8,0.4)",
    btn: "linear-gradient(135deg, #854d0e, #b45309)",
    badge: "#eab308",
    glow: "rgba(234,179,8,0.08)",
    gradFrom: "rgba(234,179,8,0.06)",
    accent: "#b45309",
  },
  placement: {
    border: "rgba(168,85,247,0.35)",
    btn: "linear-gradient(135deg, #7c3aed, #9333ea)",
    badge: "#a855f7",
    glow: "rgba(168,85,247,0.08)",
    gradFrom: "rgba(168,85,247,0.06)",
    accent: "#7c3aed",
  },
};

interface Props {
  course: Course;
  userTier: CourseTier;
  onClose: () => void;
}

export default function UpgradeModal({ course, userTier, onClose }: Props) {
  const c = SLUG_COLORS[course.slug] ?? SLUG_COLORS.foundation;
  const highlights = UPGRADE_HIGHLIGHTS[course.slug] ?? [];
  const { user, refreshUser } = useAuth();
  const { initiatePayment } = useRazorpay();
  const [isPaying, setIsPaying] = useState(false);
  const { appliedCoupon, applying, error: couponError, apply: applyCoupon, remove: removeCoupon } =
    useCoupon(course.tier as Exclude<CourseTier, "NONE">);

  const isUpgrade = userTier !== "NONE" && !course.hasAccess;
  const currentPrice = COURSE_PRICES[userTier] ?? 0;
  const basePrice = course.upgradePrice ?? course.price;
  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : basePrice;
  const saved = isUpgrade ? currentPrice : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !isPaying) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isPaying]);

  const handlePayment = async () => {
    if (!user || isPaying) return;

    setIsPaying(true);
    const result = await initiatePayment({
      tier: course.tier as Exclude<CourseTier, "NONE">,
      amount: finalPrice,
      userName: user.name,
      userEmail: user.email,
      accentColor: c.accent,
      couponCode: appliedCoupon?.code,
    });
    setIsPaying(false);

    if (result.success) {
      await refreshUser();
      toast.success("Payment successful! Your tier has been upgraded.");
      onClose();
    } else if (result.error && result.error !== "cancelled") {
      toast.error(result.error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,8,0.85)", backdropFilter: "blur(12px)" }}
        onClick={() => { if (!isPaying) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0d0d22, #0a0a1a)",
            border: `1px solid ${c.border}`,
            boxShadow: `0 0 60px ${c.glow}, 0 24px 60px rgba(0,0,0,0.8)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shimmer top bar */}
          <div className="h-1 w-full" style={{ background: c.btn }} />

          {/* Close */}
          <button
            onClick={() => { if (!isPaying) onClose(); }}
            disabled={isPaying}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-40"
            style={{ color: "#8888aa" }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6">
            {/* Icon + heading */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: c.gradFrom, border: `1px solid ${c.border}` }}
              >
                <Sparkles className="w-5 h-5" style={{ color: c.badge }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {course.hasAccess ? "Already Enrolled" : isUpgrade ? "Upgrade Your Plan" : "Unlock Course"}
                </h2>
                <p className="text-xs" style={{ color: "#8888aa" }}>
                  {course.title}
                </p>
              </div>
            </div>

            {/* Tier flow */}
            <div
              className="flex items-center gap-2 mb-5 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex-1 text-center">
                <p className="text-xs mb-1" style={{ color: "#555577" }}>Current Plan</p>
                <p className="text-sm font-semibold text-white">{TIER_LABELS[userTier]}</p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: c.badge }} />
              <div className="flex-1 text-center">
                <p className="text-xs mb-1" style={{ color: c.badge }}>Upgrading To</p>
                <p className="text-sm font-semibold text-white">{TIER_LABELS[course.tier]}</p>
              </div>
            </div>

            {/* Pricing */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: `${c.gradFrom}`, border: `1px solid ${c.border}` }}
            >
              {isUpgrade ? (
                <>
                  <p className="text-xs mb-1" style={{ color: "#8888aa" }}>
                    You already own <span style={{ color: c.badge }}>{TIER_LABELS[userTier]}</span>
                  </p>
                  <p className="text-2xl font-bold mb-1" style={{ color: c.badge }}>
                    ₹{finalPrice.toLocaleString()}
                    <span className="text-sm font-normal ml-2 line-through" style={{ color: "#555577" }}>
                      ₹{course.price.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs" style={{ color: "#22c55e" }}>
                    You save ₹{saved.toLocaleString()} with your current plan
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs mb-1" style={{ color: "#8888aa" }}>One-time payment</p>
                  <p className="text-2xl font-bold" style={{ color: c.badge }}>
                    ₹{finalPrice.toLocaleString()}
                  </p>
                </>
              )}

              {appliedCoupon && (
                <div className="mt-3 pt-3 space-y-1" style={{ borderTop: `1px solid ${c.border}` }}>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "#8888aa" }}>Original Price</span>
                    <span style={{ color: "#8888aa" }}>₹{appliedCoupon.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "#22c55e" }}>Coupon Discount ({appliedCoupon.code})</span>
                    <span style={{ color: "#22c55e" }}>−₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold pt-1">
                    <span className="text-white">Final Payable</span>
                    <span style={{ color: c.badge }}>₹{appliedCoupon.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <CouponInput
              appliedCoupon={appliedCoupon}
              applying={applying}
              error={couponError}
              onApply={applyCoupon}
              onRemove={removeCoupon}
              accentColor={c.accent}
            />

            {/* Features */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#555577" }}>
                What you unlock
              </p>
              <div className="space-y-2">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2.5 text-sm">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${c.gradFrom}`, border: `1px solid ${c.border}` }}
                    >
                      <Check className="w-3 h-3" style={{ color: c.badge }} />
                    </div>
                    <span style={{ color: "#ccccdd" }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked note */}
            <div
              className="flex items-center gap-2 text-xs mb-5 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "#555577" }} />
              <span style={{ color: "#8888aa" }}>
                All lectures, practice sets, and assignments are locked until purchase.
              </span>
            </div>

            {/* CTA */}
            <button
              className="w-full h-11 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: c.btn, boxShadow: `0 0 20px ${c.glow}` }}
              onClick={handlePayment}
              disabled={isPaying || course.hasAccess}
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isUpgrade
                    ? `Upgrade for ₹${finalPrice.toLocaleString()}`
                    : `Enroll for ₹${finalPrice.toLocaleString()}`}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "#555577" }}>
              Secure payment via Razorpay · Lifetime access
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
