"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Zap, Trophy } from "lucide-react";
import { useLeaderboard } from "@/hooks/useContests";
import type { LeaderboardUser } from "@/lib/data/contests";

const PODIUM_CONFIG = [
  { pos: 2, order: 0, height: "h-24", medal: "🥈", glow: "rgba(148,163,184,0.25)", border: "rgba(148,163,184,0.35)", color: "#94a3b8", crownColor: "#94a3b8", mt: "mt-6" },
  { pos: 1, order: 1, height: "h-32", medal: "🥇", glow: "rgba(245,158,11,0.3)",  border: "rgba(245,158,11,0.5)",  color: "#f59e0b", crownColor: "#f59e0b", mt: "mt-0" },
  { pos: 3, order: 2, height: "h-20", medal: "🥉", glow: "rgba(194,113,79,0.25)", border: "rgba(194,113,79,0.35)", color: "#c2714f", crownColor: "#c2714f", mt: "mt-8" },
];

const BADGE_COLOR: Record<string, { color: string; bg: string }> = {
  Grandmaster:       { color: "#f87171", bg: "rgba(239,68,68,0.1)" },
  "Candidate Master":{ color: "#d946ef", bg: "rgba(217,70,239,0.1)" },
  Master:            { color: "#c084fc", bg: "rgba(168,85,247,0.1)" },
  Expert:            { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  Specialist:        { color: "#4ade80", bg: "rgba(34,197,94,0.1)"  },
  Pupil:             { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  Beginner:          { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

function Avatar({ initials, size = "md", color }: { initials: string; size?: "sm" | "md" | "lg"; color: string }) {
  const s = size === "lg" ? "w-16 h-16 text-xl" : size === "md" ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        border: `2px solid ${color}55`,
        color: color,
      }}
    >
      {initials}
    </div>
  );
}

function PodiumCard({ user, config }: { user: LeaderboardUser; config: typeof PODIUM_CONFIG[0] }) {
  const badge = BADGE_COLOR[user.badge] ?? BADGE_COLOR.Pupil;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: config.order * 0.1 }}
      className={`flex flex-col items-center gap-3 ${config.mt}`}
    >
      {config.pos === 1 && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crown className="w-7 h-7" style={{ color: "#f59e0b", filter: "drop-shadow(0 0 8px rgba(245,158,11,0.6))" }} />
        </motion.div>
      )}

      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: config.glow, transform: "scale(1.3)" }}
        />
        <div
          className="relative rounded-full p-0.5"
          style={{ border: `2px solid ${config.border}` }}
        >
          <Avatar initials={user.initials} size="lg" color={config.color} />
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
          style={{
            background: config.color,
            color: "#000",
            boxShadow: `0 0 10px ${config.color}`,
          }}
        >
          {config.pos}
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-sm text-white">{user.name}</p>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ color: badge.color, background: badge.bg }}
        >
          {user.badge}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1 text-xs">
        <div className="flex items-center gap-1 font-bold" style={{ color: "#e2e8f0" }}>
          <Star className="w-3 h-3" style={{ color: config.color }} />
          {user.rating.toLocaleString()}
        </div>
        <div className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
          <Zap className="w-3 h-3" />
          {user.xp.toLocaleString()} XP
        </div>
        <div style={{ color: "#8888aa" }}>{user.solved} solved</div>
      </div>

      <div
        className={`w-20 ${config.height} rounded-t-xl flex items-end justify-center pb-2`}
        style={{
          background: `linear-gradient(180deg, ${config.color}22 0%, ${config.color}0a 100%)`,
          border: `1px solid ${config.border}`,
          borderBottom: "none",
        }}
      >
        <span className="text-2xl">{config.medal}</span>
      </div>
    </motion.div>
  );
}

function RankRow({ user, index }: { user: LeaderboardUser; index: number }) {
  const badge = BADGE_COLOR[user.badge] ?? BADGE_COLOR.Pupil;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ backgroundColor: "rgba(99,102,241,0.05)", x: 4 }}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
      style={{ border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", color: "#8888aa" }}
      >
        #{user.rank}
      </div>
      <Avatar initials={user.initials} size="sm" color="#6366f1" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white truncate">{user.name}</p>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ color: badge.color, background: badge.bg }}
        >
          {user.badge}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-5 text-xs">
        <div className="text-center">
          <p className="font-bold" style={{ color: "#e2e8f0" }}>{user.rating}</p>
          <p style={{ color: "#8888aa" }}>Rating</p>
        </div>
        <div className="text-center">
          <p className="font-bold" style={{ color: "#fbbf24" }}>{(user.xp / 1000).toFixed(1)}k</p>
          <p style={{ color: "#8888aa" }}>XP</p>
        </div>
        <div className="text-center">
          <p className="font-bold" style={{ color: "#22d3ee" }}>{user.solved}</p>
          <p style={{ color: "#8888aa" }}>Solved</p>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyLeaderboard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Trophy className="w-12 h-12 mb-4" style={{ color: "#333355" }} />
      <p className="text-sm font-medium" style={{ color: "#555577" }}>No rankings yet</p>
      <p className="text-xs mt-1" style={{ color: "#444466" }}>Be the first to join a contest and claim the top spot</p>
    </div>
  );
}

export default function Leaderboard() {
  const [tab, setTab] = useState<"global" | "batch">("global");
  const { data: users = [], isLoading } = useLeaderboard();

  const podiumUsers = users.length >= 3
    ? [users[1], users[0], users[2]]
    : [];
  const rowUsers = users.slice(3);

  return (
    <div>
      <div
        className="inline-flex p-1 rounded-xl mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {(["global", "batch"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
            style={{ color: tab === t ? "#fff" : "#8888aa" }}
          >
            {tab === t && (
              <motion.div
                layoutId="leaderboard-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 capitalize">
              {t === "global" ? "Global Rankings" : "Batch Rankings"}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyLeaderboard />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {podiumUsers.length === 3 && (
              <div
                className="flex items-end justify-center gap-4 sm:gap-8 mb-8 pb-6 pt-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {PODIUM_CONFIG.map((config) => {
                  const user = podiumUsers[config.order];
                  return user ? <PodiumCard key={config.pos} user={user} config={config} /> : null;
                })}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {(podiumUsers.length === 3 ? rowUsers : users).map((u, i) => (
                <RankRow key={u.rank} user={u} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
