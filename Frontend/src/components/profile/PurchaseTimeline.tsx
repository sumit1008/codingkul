"use client";

import { CheckCircle2 } from "lucide-react";
import type { Purchase } from "@/types/profile";

const TIER_COLOR: Record<string, string> = {
  FOUNDATION: "#22c55e",
  ACCELERATOR: "#eab308",
  PLACEMENT: "#a855f7",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PurchaseTimeline({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm" style={{ color: "#8888aa" }}>No purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#8888aa" }}>Purchase Timeline</h3>
      <div className="space-y-0">
        {purchases.map((p, i) => {
          const color = TIER_COLOR[p.courseTier] ?? "#6366f1";
          const isLast = i === purchases.length - 1;
          return (
            <div key={p._id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}1a`, border: `1px solid ${color}` }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color }} />
                </div>
                {!isLast && <div className="w-px flex-1 my-1" style={{ background: "rgba(255,255,255,0.1)" }} />}
              </div>
              <div className={isLast ? "pb-0" : "pb-6"}>
                <p className="text-sm font-semibold text-white">{p.courseTitle}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
                  {formatDate(p.createdAt)} · ₹{p.finalAmount.toLocaleString()} paid
                  {p.couponCode && ` · ${p.couponCode} applied`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
