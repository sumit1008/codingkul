"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Trophy, Users, Star, Zap } from "lucide-react";
import { toast } from "sonner";

interface ContestStats {
  total: number;
  upcoming: number;
  running: number;
  completed: number;
  processed: number;
  totalXP: number;
}

export default function ContestAnalyticsView() {
  const [stats, setStats]   = useState<ContestStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch("/api/contests?limit=100");
      const j = await r.json();
      const contests: { status: string; processedResults: boolean; xpReward: number }[] =
        j.data?.contests ?? [];

      const result: ContestStats = {
        total:     contests.length,
        upcoming:  contests.filter((c) => c.status === "upcoming").length,
        running:   contests.filter((c) => c.status === "running").length,
        completed: contests.filter((c) => c.status === "completed").length,
        processed: contests.filter((c) => c.processedResults).length,
        totalXP:   contests.reduce((sum, c) => sum + (c.xpReward ?? 0), 0),
      };
      setStats(result);
    } catch { toast.error("Failed to load analytics"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const cards = stats
    ? [
        { label: "Total Contests",   value: String(stats.total),     icon: Trophy,  color: "#6366f1", bg: "rgba(99,102,241,0.12)"  },
        { label: "Upcoming",         value: String(stats.upcoming),  icon: Star,    color: "#6366f1", bg: "rgba(99,102,241,0.08)"  },
        { label: "Running",          value: String(stats.running),   icon: Users,   color: "#22c55e", bg: "rgba(34,197,94,0.08)"   },
        { label: "Results Processed",value: String(stats.processed), icon: Zap,     color: "#a855f7", bg: "rgba(168,85,247,0.08)"  },
      ]
    : [];

  return (
    <div className="mb-8">
      {loading ? (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-4 h-4 text-text-faint animate-spin" />
          <span className="text-xs text-text-faint">Loading stats…</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: c.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-text">{c.value}</p>
                  <p className="text-xs text-text-faint">{c.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
