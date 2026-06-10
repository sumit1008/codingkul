"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, ArrowRight, Lock, Loader2 } from "lucide-react";
import { Course } from "@/types/course";
import {
  useAuth,
  getHighestPurchasedTier,
  PRODUCT_TIER_LABELS,
} from "@/lib/auth-context";
import { initiateProductPurchase } from "@/services/payment";

const UPGRADE_HIGHLIGHTS: Record<string, string[]> = {
  foundation: [
    "Regular Live DSA Classes",
    "240 Hours Content",
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

const SLUG_COLORS: Record<string, { border: string; btn: string; badge: string; glow: string; gradFrom: string }> = {
  foundation: {
    border: "rgba(34,197,94,0.35)",
    btn: "linear-gradient(135deg, #15803d, #16a34a)",
    badge: "#22c55e",
    glow: "rgba(34,197,94,0.08)",
    gradFrom: "rgba(34,197,94,0.06)",
  },
  accelerator: {
    border: "rgba(234,179,8,0.4)",
    btn: "linear-gradient(135deg, #854d0e, #b45309)",
    badge: "#eab308",
    glow: "rgba(234,179,8,0.08)",
    gradFrom: "rgba(234,179,8,0.06)",
  },
  placement: {
    border: "rgba(168,85,247,0.35)",
    btn: "linear-gradient(135deg, #7c3aed, #9333ea)",
    badge: "#a855f7",
    glow: "rgba(168,85,247,0.08)",
    gradFrom: "rgba(168,85,247,0.06)",
  },
};

interface Props {
  course: Course;
  onClose: () => void;
}

export default function UpgradeModal({ course, onClose }: Props) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [paying, setPaying] = useState(false);

  const c = SLUG_COLORS[course.slug] ?? SLUG_COLORS.foundation;
  const highlights = UPGRADE_HIGHLIGHTS[course.slug] ?? [];

  const highestTier = getHighestPurchasedTier(user);
  const isUpgrade = highestTier !== null && !course.hasAccess;
  const currentPlanLabel = highestTier ? (PRODUCT_TIER_LABELS[highestTier] ?? "Free Plan") : "Free Plan";
  const targetPlanLabel = PRODUCT_TIER_LABELS[course.slug] ?? course.title;

  // upgradePrice = discounted price (set by backend); price = full price
  const displayPrice = course.upgradePrice ?? course.price;
  const savings = course.upgradePrice !== null ? course.price - course.upgradePrice : 0;

  const handlePurchase = async () => {
    if (!user || paying) return;
    setPaying(true);
    await initiateProductPurchase({
      productId:  course.slug,
      userName:   user.name,
      userEmail:  user.email,
      onSuccess:  async () => {
        await refreshUser();
        onClose();
        router.push(`/payment/success?product=${course.slug}`);
      },
      onFailure:  (reason) => {
        setPaying(false);
        if (reason !== "Payment cancelled") {
          router.push(`/payment/failed?reason=${encodeURIComponent(reason)}`);
          onClose();
        }
      },
    });
    setPaying(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !paying) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, paying]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,8,0.85)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
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
          {/* Color top bar */}
          <div className="h-1 w-full" style={{ background: c.btn }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/5"
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
                  {isUpgrade ? "Upgrade Your Plan" : "Unlock Course"}
                </h2>
                <p className="text-xs" style={{ color: "#8888aa" }}>{course.title}</p>
              </div>
            </div>

            {/* Plan flow */}
            <div
              className="flex items-center gap-2 mb-5 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex-1 text-center">
                <p className="text-xs mb-1" style={{ color: "#555577" }}>Current Plan</p>
                <p className="text-sm font-semibold text-white">{currentPlanLabel}</p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: c.badge }} />
              <div className="flex-1 text-center">
                <p className="text-xs mb-1" style={{ color: c.badge }}>
                  {isUpgrade ? "Upgrading To" : "Enrolling In"}
                </p>
                <p className="text-sm font-semibold text-white">{targetPlanLabel}</p>
              </div>
            </div>

            {/* Pricing */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: c.gradFrom, border: `1px solid ${c.border}` }}
            >
              {isUpgrade && savings > 0 ? (
                <>
                  <p className="text-xs mb-2" style={{ color: "#8888aa" }}>
                    Upgrading from <span style={{ color: c.badge }}>{currentPlanLabel}</span>
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold" style={{ color: c.badge }}>
                      ₹{displayPrice.toLocaleString()}
                    </p>
                    <p className="text-base line-through" style={{ color: "#555577" }}>
                      ₹{course.price.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
                  >
                    You save ₹{savings.toLocaleString()}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold" style={{ color: c.badge }}>
                    ₹{displayPrice.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#555577" }}>One-time payment · Lifetime access</p>
                </>
              )}
            </div>

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
                      style={{ background: c.gradFrom, border: `1px solid ${c.border}` }}
                    >
                      <Check className="w-3 h-3" style={{ color: c.badge }} />
                    </div>
                    <span style={{ color: "#ccccdd" }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lock note */}
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
              disabled={paying}
              className="w-full h-11 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ background: c.btn, boxShadow: `0 0 20px ${c.glow}` }}
              onClick={handlePurchase}
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isUpgrade && savings > 0
                    ? `Upgrade — ₹${displayPrice.toLocaleString()}`
                    : `Enroll — ₹${displayPrice.toLocaleString()}`}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "#555577" }}>
              Secure payment · Powered by Razorpay
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
