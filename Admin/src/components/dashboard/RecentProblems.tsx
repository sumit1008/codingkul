"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { formatDate, difficultyColor } from "@/lib/utils";
import type { AnalyticsData } from "@/types";

export default function RecentProblems() {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text">Recently Added</h3>
        <Link href="/dashboard/problems" className="text-xs text-primary-light hover:text-primary transition-colors">
          View all →
        </Link>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-16 rounded-full bg-white/5 animate-pulse ml-auto" />
            </div>
          ))
        ) : data?.recentProblems.length === 0 ? (
          <div className="px-6 py-8 text-center text-text-muted text-sm">No problems yet</div>
        ) : (
          (data?.recentProblems ?? []).map((p) => (
            <div key={String(p._id)} className="px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{p.title}</p>
                <p className="text-xs text-text-faint mt-0.5">{p.topic} · {formatDate(p.createdAt)}</p>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${difficultyColor(p.difficulty)}`}>
                {p.difficulty}
              </span>
              <Link href={`/dashboard/problems/${p._id}`}>
                <ExternalLink className="w-3.5 h-3.5 text-text-faint hover:text-primary-light transition-colors flex-shrink-0" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
