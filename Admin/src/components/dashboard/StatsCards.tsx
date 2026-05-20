"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Code2, CheckCircle, TrendingUp, Loader2 } from "lucide-react";
import type { AnalyticsData } from "@/types";

export default function StatsCards() {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Sheets",
      value: data?.totalSheets ?? 0,
      icon: FileSpreadsheet,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.2)",
    },
    {
      label: "Total Problems",
      value: data?.totalProblems ?? 0,
      icon: Code2,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.2)",
    },
    {
      label: "Published Sheets",
      value: data?.publishedSheets ?? 0,
      icon: CheckCircle,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    },
    {
      label: "Easy / Med / Hard",
      value: data
        ? `${data.difficultyBreakdown.Easy} / ${data.difficultyBreakdown.Medium} / ${data.difficultyBreakdown.Hard}`
        : "— / — / —",
      icon: TrendingUp,
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl p-5"
            style={{ background: "#0c0c1e", border: `1px solid ${card.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
            </div>
            <p className="text-2xl font-bold text-text tracking-tight">
              {loading ? <span className="text-text-faint">—</span> : card.value}
            </p>
            <p className="text-sm text-text-muted mt-1">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
