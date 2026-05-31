"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Trophy, Flame, TrendingUp, Zap, Target, Star,
  Lock, Activity, Clock, BookOpen, ClipboardList, Swords,
  Award, ArrowUp, Minus, Code2, Shield, BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import WelcomeTransition from "@/components/dashboard/welcome-transition";
import BatchActivityCard from "@/components/batch/BatchActivityCard";
import type { DashboardAchievement } from "@/lib/api";

const HEATMAP_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(99,102,241,0.28)",
  "rgba(99,102,241,0.58)",
  "rgba(99,102,241,0.92)",
];

const ACHIEVEMENT_COLOR: Record<string, { color: string; bg: string; border: string }> = {
  green:  { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.22)" },
  indigo: { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.22)" },
  purple: { color: "#a855f7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)"  },
  cyan:   { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.18)" },
};

const ACHIEVEMENT_ICON: Record<string, React.ElementType> = {
  homework_warrior: Award,
  contest_grinder:  Swords,
  elite_coder:      Code2,
  consistency:      Shield,
};

function TrendBadge({ trend }: { trend: number }) {
  if (trend > 0)
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
        <ArrowUp className="w-2.5 h-2.5" />{trend}
      </span>
    );
  if (trend < 0)
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-400">
        <ArrowUp className="w-2.5 h-2.5 rotate-180" />{Math.abs(trend)}
      </span>
    );
  return <Minus className="w-3 h-3" style={{ color: "#555577" }} />;
}

function StatSkeleton() {
  return (
    <div className="h-5 w-16 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
  );
}

function AchievementCard({ a }: { a: DashboardAchievement }) {
  const c = ACHIEVEMENT_COLOR[a.colorKey] ?? ACHIEVEMENT_COLOR.indigo;
  const Icon = ACHIEVEMENT_ICON[a.id] ?? Award;
  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: a.earned ? c.bg : "rgba(255,255,255,0.02)",
        border: `1px solid ${a.earned ? c.border : "rgba(255,255,255,0.06)"}`,
        opacity: a.earned ? 1 : 0.6,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = a.earned ? "1" : "0.6"; }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: a.earned ? c.bg : "rgba(255,255,255,0.04)", border: `1px solid ${c.border}` }}
      >
        {a.earned
          ? <Icon className="w-4 h-4" style={{ color: c.color }} />
          : <Lock className="w-4 h-4" style={{ color: "#555577" }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white">{a.title}</p>
        <p className="text-[10px]" style={{ color: "#8888aa" }}>{a.desc}</p>
        {!a.earned && (
          <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(a.progress / a.total) * 100}%`, background: c.color }}
            />
          </div>
        )}
      </div>
      {a.earned
        ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: c.color }} />
        : <span className="text-[10px] shrink-0 font-mono" style={{ color: "#555577" }}>{a.progress}/{a.total}</span>
      }
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dash, isLoading: dashLoading } = useDashboard();

  const [showWelcome, setShowWelcome] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [goals, setGoals] = useState([
    { id: 1, text: "Solve 5 problems", done: false },
    { id: 2, text: "Review notes", done: false },
    { id: 3, text: "Sliding window module", done: false },
    { id: 4, text: "Watch editorial", done: false },
    { id: 5, text: "Mock interview practice", done: false },
  ]);

  useEffect(() => {
    if (sessionStorage.getItem("ck_new_login")) {
      sessionStorage.removeItem("ck_new_login");
      setShowWelcome(true);
    }
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  const xpPct = user ? Math.min(100, Math.round((user.xp / user.xpMax) * 100)) : 0;
  const goalsDone = goals.filter((g) => g.done).length;

  // Build secondary stats from real data
  const secondaryStats = [
    {
      icon: CheckCircle2,
      label: "Problems Solved",
      value: dashLoading ? null : String(dash?.stats.solved ?? 0),
      sub: "Total solved",
      color: "#10b981",
    },
    {
      icon: ClipboardList,
      label: "Homework Done",
      value: dashLoading ? null : `${dash?.stats.hwPct ?? 0}%`,
      sub: dashLoading ? "" : `${dash?.stats.hwCompleted ?? 0} / ${dash?.stats.hwTotal ?? 0} tasks`,
      color: "#6366f1",
    },
    {
      icon: Trophy,
      label: "Contest Rating",
      value: dashLoading ? null : (dash?.stats.rating ?? user?.rating ?? 1200).toLocaleString(),
      sub: dashLoading ? "" : (dash?.stats.rankTitle ?? user?.title ?? "Pupil"),
      color: "#f59e0b",
    },
    {
      icon: Swords,
      label: "Contests",
      value: dashLoading ? null : String(dash?.stats.contestsParticipated ?? 0),
      sub: "contests joined",
      color: "#a855f7",
    },
    {
      icon: BookOpen,
      label: "Enrolled",
      value: dashLoading ? null : String(dash?.stats.enrolledBatches ?? 0),
      sub: "active courses",
      color: "#22d3ee",
    },
    {
      icon: Zap,
      label: "Total XP",
      value: dashLoading ? null : (user?.xp ?? 0).toLocaleString(),
      sub: `Level ${user?.level ?? 1}`,
      color: "#facc15",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeTransition onComplete={() => setShowWelcome(false)} />}
      </AnimatePresence>

      <div className="p-5 lg:p-7 space-y-6 max-w-360">

        {/* ── Hero banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.16) 0%, rgba(168,85,247,0.1) 50%, rgba(34,211,238,0.05) 100%)",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow: "0 0 80px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.8), transparent 65%)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.8), transparent 65%)", filter: "blur(30px)" }} />

          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-sm mb-1" style={{ color: "#8888aa" }}>
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {greeting}, {user?.name.split(" ")[0]} 👋
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.22)", color: "#fb923c" }}>
                  <Flame className="w-4 h-4" />
                  {user?.streak ?? 0} day streak! 🔥
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)", color: "#a5b4fc" }}>
                  <Star className="w-4 h-4" />
                  Level {user?.level ?? 1} · {user?.title ?? "Pupil"}
                </div>
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: Zap,        label: "Total XP",       value: (user?.xp ?? 0).toLocaleString(),                          color: "#facc15" },
                { icon: Trophy,     label: "Global Rank",    value: dashLoading ? "…" : `#${dash?.stats.rank ?? "—"}`,         color: "#f59e0b" },
                { icon: Flame,      label: "Streak",         value: `${user?.streak ?? 0}d`,                                   color: "#f97316" },
                { icon: TrendingUp, label: "Contest Rating", value: dashLoading ? "…" : (dash?.stats.rating ?? user?.rating ?? 1200).toLocaleString(), color: "#6366f1" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-3.5"
                  style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "#8888aa" }}>{s.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            {/* XP bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: "#8888aa" }}>XP Progress — Level {user?.level ?? 1} → {(user?.level ?? 1) + 1}</span>
                <span className="font-semibold" style={{ color: "#a5b4fc" }}>
                  {(user?.xp ?? 0).toLocaleString()} / {(user?.xpMax ?? 1000).toLocaleString()}
                  <span className="ml-1.5" style={{ color: "#555577" }}>({xpPct}%)</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)", boxShadow: "0 0 12px rgba(99,102,241,0.5)" }}
                />
              </div>
              <p className="text-[10px] mt-1.5" style={{ color: "#555577" }}>
                {Math.max(0, (user?.xpMax ?? 1000) - (user?.xp ?? 0)).toLocaleString()} XP to unlock Level {(user?.level ?? 1) + 1}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Secondary stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {secondaryStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="rounded-2xl p-4 cursor-default"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}35`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${s.color}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              {s.value === null ? (
                <StatSkeleton />
              ) : (
                <div className="text-lg font-bold text-white leading-tight">{s.value}</div>
              )}
              <div className="text-[10px] font-medium mt-0.5 mb-1 truncate" style={{ color: "#8888aa" }}>{s.label}</div>
              <div className="text-[10px]" style={{ color: s.color }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Main content grid ── */}
        <div className="grid xl:grid-cols-3 gap-6">

          {/* Left 2/3 */}
          <div className="xl:col-span-2 space-y-6">

            {/* Activity heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Activity — Last 52 weeks</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#555577" }}>
                  Less
                  {[0, 1, 2, 3].map((v) => (
                    <div key={v} className="w-2.5 h-2.5 rounded-full" style={{ background: HEATMAP_COLORS[v] }} />
                  ))}
                  More
                </div>
              </div>

              <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                <div className="flex gap-0.5 min-w-max pb-1">
                  {dashLoading || !dash ? (
                    Array.from({ length: 52 }, (_, w) => (
                      <div key={w} className="flex flex-col gap-0.5">
                        {Array.from({ length: 7 }, (_, d) => (
                          <div key={d} className="w-2.5 h-2.5 rounded-full" style={{ background: HEATMAP_COLORS[0] }} />
                        ))}
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 52 }, (_, w) => (
                      <div key={w} className="flex flex-col gap-0.5">
                        {Array.from({ length: 7 }, (_, d) => {
                          const cell = dash.heatmap[w * 7 + d];
                          return (
                            <div
                              key={d}
                              className="w-2.5 h-2.5 rounded-full transition-transform duration-100 hover:scale-125 cursor-pointer"
                              style={{ background: HEATMAP_COLORS[cell?.intensity ?? 0] }}
                              title={cell ? `${cell.date}: ${cell.count} activities` : ""}
                            />
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-6 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {[
                  { label: "Total Days", value: "364" },
                  { label: "Active Days", value: dashLoading ? "…" : String(dash?.stats.activeDays ?? 0) },
                  { label: "Current Streak", value: `${user?.streak ?? 0}d` },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-base font-bold text-white">{s.value}</div>
                    <div className="text-[10px]" style={{ color: "#8888aa" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">Recent Activity</span>
              </div>
              {dashLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>
              ) : (dash?.recentActivity?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="w-8 h-8 mb-3" style={{ color: "#333355" }} />
                  <p className="text-sm font-medium" style={{ color: "#555577" }}>No recent activity yet</p>
                  <p className="text-xs mt-1" style={{ color: "#444466" }}>Solve problems, attend classes, or join a contest to get started</p>
                </div>
              ) : null}
            </motion.div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-5">

            {/* Batch activity widget */}
            <BatchActivityCard />

            {/* Daily goals */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "rgba(16,185,129,0.04)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.7), transparent 65%)", filter: "blur(24px)" }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">Daily Goals</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}
                  >
                    {goalsDone}/{goals.length}
                  </span>
                </div>
                <p className="text-[11px] mb-4" style={{ color: "#8888aa" }}>Keep the momentum going!</p>

                <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(goalsDone / goals.length) * 100}%`,
                      background: "linear-gradient(90deg, #10b981, #34d399)",
                      boxShadow: "0 0 8px rgba(16,185,129,0.4)",
                    }}
                  />
                </div>

                <div className="space-y-2.5">
                  {goals.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-3 cursor-pointer select-none group"
                      onClick={() => setGoals((gs) => gs.map((x) => x.id === g.id ? { ...x, done: !x.done } : x))}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          background: g.done ? "linear-gradient(135deg, #10b981, #34d399)" : "rgba(255,255,255,0.06)",
                          border: g.done ? "none" : "1.5px solid rgba(16,185,129,0.3)",
                          boxShadow: g.done ? "0 0 8px rgba(16,185,129,0.4)" : "none",
                        }}
                      >
                        {g.done && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-sm transition-all"
                        style={{
                          color: g.done ? "#555577" : "#aaaacc",
                          textDecoration: g.done ? "line-through" : "none",
                        }}
                      >
                        {g.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Achievements</span>
                </div>
                <span className="text-xs" style={{ color: "#8888aa" }}>
                  {dashLoading ? "…" : `${dash?.achievements.filter((a) => a.earned).length ?? 0}/${dash?.achievements.length ?? 4}`}
                </span>
              </div>
              {dashLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(dash?.achievements ?? []).map((a) => (
                    <AchievementCard key={a.id} a={a} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Leaderboard</span>
                </div>
                <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">
                  View all →
                </span>
              </div>

              {dashLoading ? (
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-9 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {(dash?.leaderboard ?? [])
                    .filter((u) => !u.isCurrentUser)
                    .map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors hover:bg-white/3 cursor-pointer"
                      >
                        <span
                          className="w-5 text-center text-xs font-bold shrink-0"
                          style={{
                            color: u.rank === 1 ? "#f59e0b" : u.rank === 2 ? "#94a3b8" : u.rank === 3 ? "#b45309" : "#555577",
                          }}
                        >
                          {u.rank <= 3 ? ["🥇", "🥈", "🥉"][u.rank - 1] : u.rank}
                        </span>
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                        >
                          {u.avatar}
                        </div>
                        <span className="text-xs font-medium text-white flex-1 truncate">{u.name}</span>
                        <TrendBadge trend={0} />
                        <span className="text-xs font-semibold shrink-0" style={{ color: "#a5b4fc" }}>
                          {u.xp.toLocaleString()}
                        </span>
                      </div>
                    ))}

                  {/* Current user row */}
                  {dash?.leaderboard.some((u) => u.isCurrentUser) && (
                    <div
                      className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl mt-2"
                      style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <span className="w-5 text-center text-xs font-bold text-indigo-400 shrink-0">
                        {dash.stats.rank}
                      </span>
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                      >
                        {user?.avatar}
                      </div>
                      <span className="text-xs font-medium text-white flex-1 truncate">
                        {user?.name.split(" ")[0]}{" "}
                        <span style={{ color: "#555577" }}>(you)</span>
                      </span>
                      <span className="text-xs font-semibold text-indigo-400 shrink-0">
                        {(user?.xp ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </>
  );
}
