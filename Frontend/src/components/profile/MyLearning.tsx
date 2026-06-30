"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import type { Purchase } from "@/types/profile";

const TIER_COLOR: Record<string, string> = {
  FOUNDATION: "#22c55e",
  ACCELERATOR: "#eab308",
  PLACEMENT: "#a855f7",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MyLearning({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm mb-4" style={{ color: "#8888aa" }}>You haven&apos;t purchased a course yet.</p>
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          Browse Courses <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // One card per tier ever owned, earliest purchase date for that tier.
  const byTier = new Map<string, Purchase>();
  for (const p of purchases) {
    if (!byTier.has(p.courseTier)) byTier.set(p.courseTier, p);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...byTier.values()].map((p) => {
        const color = TIER_COLOR[p.courseTier] ?? "#6366f1";
        return (
          <div key={p.courseTier} className="rounded-2xl p-5" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
                <GraduationCap className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{p.courseTitle}</p>
                <p className="text-xs" style={{ color: "#8888aa" }}>Purchased {formatDate(p.createdAt)}</p>
              </div>
            </div>

            <div
              className="flex items-center justify-between text-xs px-3 py-2 rounded-xl mb-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ color: "#666688" }}>Progress tracking</span>
              <span className="font-semibold" style={{ color: "#555577" }}>Coming Soon</span>
            </div>

            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: color }}
            >
              Continue Learning <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
