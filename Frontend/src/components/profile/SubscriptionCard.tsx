"use client";

import { Crown, CheckCircle2 } from "lucide-react";
import type { Subscription } from "@/types/profile";

const TIER_COLOR: Record<string, string> = {
  FOUNDATION: "#22c55e",
  ACCELERATOR: "#eab308",
  PLACEMENT: "#a855f7",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  if (subscription.courseTier === "NONE" || !subscription.purchase) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm" style={{ color: "#8888aa" }}>You don&apos;t have an active subscription yet.</p>
      </div>
    );
  }

  const { purchase } = subscription;
  const color = TIER_COLOR[subscription.courseTier] ?? "#6366f1";

  return (
    <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
            <Crown className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{subscription.tierLabel ?? subscription.courseTier}</p>
            <p className="text-xs" style={{ color: "#8888aa" }}>Current Plan</p>
          </div>
        </div>
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> {subscription.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <div>
          <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Purchase Date</p>
          <p className="text-sm font-semibold text-white">{formatDate(purchase.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Amount Paid</p>
          <p className="text-sm font-semibold text-white">₹{purchase.finalAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Payment Status</p>
          <p className="text-sm font-semibold" style={{ color: "#22c55e" }}>{purchase.paymentStatus}</p>
        </div>
        {purchase.couponCode && (
          <>
            <div>
              <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Coupon Used</p>
              <p className="text-sm font-semibold text-white font-mono">{purchase.couponCode}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Discount Received</p>
              <p className="text-sm font-semibold" style={{ color: "#22c55e" }}>₹{purchase.discountAmount.toLocaleString()}</p>
            </div>
          </>
        )}
        <div>
          <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Razorpay Payment ID</p>
          <p className="text-xs font-semibold text-white font-mono truncate">{purchase.razorpayPaymentId}</p>
        </div>
      </div>
    </div>
  );
}
