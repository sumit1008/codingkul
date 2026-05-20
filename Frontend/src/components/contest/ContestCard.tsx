"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Timer, Zap, ExternalLink, Tag } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import type { Contest, Difficulty } from "@/lib/data/contests";

const DIFF: Record<Difficulty, { color: string; bg: string; border: string }> = {
  Beginner:     { color: "#4ade80", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)" },
  Intermediate: { color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  Advanced:     { color: "#f87171", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)" },
};

const TOPIC_COLORS = [
  { color: "#a5b4fc", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.2)" },
  { color: "#c4b5fd", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.2)" },
  { color: "#67e8f9", bg: "rgba(34,211,238,0.1)",   border: "rgba(34,211,238,0.2)" },
];

interface Props {
  contest: Contest;
  index: number;
}

export default function ContestCard({ contest, index }: Props) {
  const diff = DIFF[contest.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.12 }}
      whileHover={{
        y: -6,
        boxShadow: "0 0 48px rgba(99,102,241,0.22), 0 12px 40px rgba(0,0,0,0.45)",
      }}
      className="relative rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Shine sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 50%, rgba(168,85,247,0.04) 100%)",
        }}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg text-white">{contest.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
            Codeforces Ranked Contest
          </p>
        </div>
        <span
          className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}
        >
          {contest.difficulty}
        </span>
      </div>

      {/* ── Countdown ──────────────────────────────────────── */}
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide" style={{ color: "#8888aa" }}>
          <Timer className="w-3.5 h-3.5" />
          Starts in
        </div>
        <CountdownTimer targetTimestamp={contest.startTimestamp} />
      </div>

      {/* ── Meta row ───────────────────────────────────────── */}
      <div className="relative flex flex-wrap gap-4 text-xs" style={{ color: "#8888aa" }}>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
          {contest.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
          {contest.time}
        </div>
        <div className="flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
          {contest.duration}
        </div>
      </div>

      {/* ── Topics ─────────────────────────────────────────── */}
      <div className="relative flex flex-wrap gap-2">
        {contest.topics.map((topic, i) => {
          const tc = TOPIC_COLORS[i % TOPIC_COLORS.length];
          return (
            <span
              key={topic}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.border}` }}
            >
              <Tag className="w-2.5 h-2.5" />
              {topic}
            </span>
          );
        })}
      </div>

      {/* ── Footer: XP + CTA ───────────────────────────────── */}
      <div className="relative flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#fbbf24" }}
        >
          <Zap className="w-4 h-4" />
          +{contest.xpReward} XP Reward
        </div>

        <motion.a
          href={contest.codeforcesUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            boxShadow: "0 0 18px rgba(99,102,241,0.35)",
          }}
        >
          Participate on Codeforces
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.a>
      </div>
    </motion.div>
  );
}
