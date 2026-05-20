"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Zap, ArrowUp } from "lucide-react";

interface ProgressBarProps {
  value: number;
  max: number;
  gradient: string;
}

function ProgressBar({ value, max, gradient }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: 5, background: "rgba(255,255,255,0.07)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: gradient }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {/* Card 1 — Academy Rating */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -4, boxShadow: "0 0 40px rgba(168,85,247,0.2), 0 8px 32px rgba(0,0,0,0.4)" }}
        className="rounded-2xl p-5 text-left flex flex-col gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-semibold tracking-wide"
            style={{ color: "#8888aa" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)" }}
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
            </div>
            Academy Rating
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(168,85,247,0.12)",
              color: "#c084fc",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            Specialist
          </span>
        </div>

        <div
          className="text-4xl font-bold tracking-tight"
          style={{ color: "#fff" }}
        >
          1,542
        </div>

        <div className="flex flex-col gap-1.5">
          <ProgressBar value={1542} max={1600} gradient="linear-gradient(90deg, #6366f1, #a855f7)" />
          <div className="flex justify-between text-xs" style={{ color: "#8888aa" }}>
            <span>Toward Expert</span>
            <span style={{ color: "#a5b4fc" }}>1542 / 1600</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2 — Global Rank */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ y: -4, boxShadow: "0 0 40px rgba(34,211,238,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}
        className="rounded-2xl p-5 text-left flex flex-col gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-semibold tracking-wide"
            style={{ color: "#8888aa" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(34,211,238,0.1)" }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            </div>
            Global Rank
          </div>
          <div
            className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#4ade80",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <ArrowUp className="w-3 h-3" />
            +3 this week
          </div>
        </div>

        <div
          className="text-4xl font-bold tracking-tight"
          style={{ color: "#fff" }}
        >
          #12
        </div>

        <div
          className="text-xs font-medium"
          style={{ color: "#8888aa" }}
        >
          Out of 2,840 participants
        </div>
      </motion.div>

      {/* Card 3 — Total Contest XP */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ y: -4, boxShadow: "0 0 40px rgba(99,102,241,0.2), 0 8px 32px rgba(0,0,0,0.4)" }}
        className="rounded-2xl p-5 text-left flex flex-col gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-semibold tracking-wide"
            style={{ color: "#8888aa" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
            </div>
            Total Contest XP
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(99,102,241,0.12)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            Lv.24
          </span>
        </div>

        <div
          className="text-4xl font-bold tracking-tight"
          style={{ color: "#fff" }}
        >
          12,450
        </div>

        <div className="flex flex-col gap-1.5">
          <ProgressBar value={450} max={500} gradient="linear-gradient(90deg, #6366f1, #22d3ee)" />
          <div className="flex justify-between text-xs" style={{ color: "#8888aa" }}>
            <span>To Lv.25</span>
            <span style={{ color: "#a5b4fc" }}>450 / 500</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
