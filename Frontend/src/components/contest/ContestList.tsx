"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Trophy, CheckCircle2, TrendingUp, TrendingDown, Zap, ExternalLink } from "lucide-react";
import type { PreviousContest } from "@/lib/data/contests";

interface Props {
  contests: PreviousContest[];
}

function SolvedDots({ solved, total }: { solved: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: i < solved
              ? "linear-gradient(135deg, #22c55e, #4ade80)"
              : "rgba(255,255,255,0.1)",
            boxShadow: i < solved ? "0 0 6px rgba(34,197,94,0.4)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function ContestRow({ contest, index }: { contest: PreviousContest; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const positive = contest.ratingChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <motion.div
        whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
        className="rounded-xl overflow-hidden cursor-pointer"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-4">
          {/* Contest number badge */}
          <div
            className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            #{contest.number}
          </div>

          {/* Title + date */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white truncate">{contest.title}</p>
            <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "#8888aa" }}>
              <Calendar className="w-3 h-3" />
              {contest.date}
            </div>
          </div>

          {/* Stats grid — hidden on small screens, visible md+ */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Rank */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "#e2e8f0" }}>
                <Trophy className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                #{contest.rank}
              </div>
              <span className="text-[10px]" style={{ color: "#8888aa" }}>Rank</span>
            </div>

            {/* Solved */}
            <div className="flex flex-col items-center gap-1">
              <SolvedDots solved={contest.solved} total={contest.total} />
              <span className="text-[10px]" style={{ color: "#8888aa" }}>
                {contest.solved}/{contest.total} solved
              </span>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="flex items-center gap-1 text-sm font-bold"
                style={{ color: positive ? "#4ade80" : "#f87171" }}
              >
                {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {positive ? "+" : ""}{contest.ratingChange}
              </div>
              <span className="text-[10px]" style={{ color: "#8888aa" }}>Rating</span>
            </div>

            {/* XP */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "#fbbf24" }}>
                <Zap className="w-3.5 h-3.5" />
                +{contest.xpEarned}
              </div>
              <span className="text-[10px]" style={{ color: "#8888aa" }}>XP</span>
            </div>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 ml-2"
            style={{ color: "#8888aa" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-4 pb-4 pt-0 flex flex-wrap gap-4 items-center"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                {/* Mobile stats */}
                <div className="flex sm:hidden flex-wrap gap-4 w-full">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Trophy className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                    <span className="text-white font-semibold">#{contest.rank}</span>
                    <span style={{ color: "#8888aa" }}>rank</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                    <span className="text-white font-semibold">{contest.solved}/{contest.total}</span>
                    <span style={{ color: "#8888aa" }}>solved</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    {positive ? (
                      <TrendingUp className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                    )}
                    <span className="font-semibold" style={{ color: positive ? "#4ade80" : "#f87171" }}>
                      {positive ? "+" : ""}{contest.ratingChange}
                    </span>
                    <span style={{ color: "#8888aa" }}>rating</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Zap className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                    <span className="font-semibold" style={{ color: "#fbbf24" }}>+{contest.xpEarned} XP</span>
                  </div>
                </div>

                <a
                  href="https://codeforces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg ml-auto"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Codeforces
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function ContestList({ contests }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {contests.map((c, i) => (
        <ContestRow key={c.id} contest={c} index={i} />
      ))}
    </div>
  );
}
