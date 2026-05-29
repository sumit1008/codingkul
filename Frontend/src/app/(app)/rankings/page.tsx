"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Users, Clock } from "lucide-react";

const FEATURES = [
  { icon: Trophy, label: "Global Leaderboard", desc: "Rank against all Codingkul students worldwide" },
  { icon: Medal, label: "Weekly Contests", desc: "Climb the board with every contest performance" },
  { icon: TrendingUp, label: "Rating History", desc: "Track your rating curve over time" },
  { icon: Users, label: "Batch Rankings", desc: "See where you stand among your batchmates" },
];

export default function RankingsPage() {
  return (
    <div
      className="min-h-full flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#050510" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 0 32px rgba(99,102,241,0.15)",
            }}
          >
            <Trophy className="w-7 h-7" style={{ color: "#f59e0b" }} />
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>

        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Rankings
        </h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: "#8888aa" }}>
          A full competitive ranking system is on the way. Compete, climb, and prove your rank
          among thousands of students.
        </p>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: "easeOut" }}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#6366f1" }} />
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#8888aa" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
