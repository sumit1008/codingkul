"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Trophy, Flame, TrendingUp, Zap, Target, Star,
  Lock, Activity, Clock, BookOpen, ClipboardList, Swords,
  Award, ArrowUp, Minus, Code2, Play, Shield, BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import WelcomeTransition from "@/components/dashboard/welcome-transition";

// Seeded deterministic data (no hydration mismatch)
function sr(seed: number) {
  const x = Math.sin(seed + 7) * 10000;
  return x - Math.floor(x);
}
const HEATMAP = Array.from({ length: 52 * 7 }, (_, i) => {
  const r = sr(i);
  if (r > 0.74) return 3;
  if (r > 0.54) return 2;
  if (r > 0.38) return 1;
  return 0;
});
const HEATMAP_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(99,102,241,0.28)",
  "rgba(99,102,241,0.58)",
  "rgba(99,102,241,0.92)",
];

const SECONDARY_STATS = [
  { icon: CheckCircle2, label: "Problems Solved", value: "487", sub: "+12 this week", color: "#10b981" },
  { icon: ClipboardList, label: "Homework Done", value: "94%", sub: "47 / 50 tasks", color: "#6366f1" },
  { icon: Trophy, label: "Contest Rating", value: "1,847", sub: "+124 this month", color: "#f59e0b" },
  { icon: Target, label: "Accuracy", value: "87%", sub: "High performer", color: "#a855f7" },
  { icon: BookOpen, label: "Courses Done", value: "3 / 8", sub: "In progress", color: "#22d3ee" },
  { icon: Zap, label: "Total XP", value: "3,240", sub: "Level 12", color: "#facc15" },
];

const ACHIEVEMENTS = [
  {
    icon: Award, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.22)",
    title: "Homework Warrior", desc: "Complete 50 assignments", earned: true,
  },
  {
    icon: Swords, color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.22)",
    title: "Contest Grinder", desc: "Join 10 rated contests", earned: true,
  },
  {
    icon: Code2, color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)",
    title: "Elite Coder", desc: "Solve 500 problems", earned: false, progress: 487, total: 500,
  },
  {
    icon: Shield, color: "#22d3ee", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.18)",
    title: "Consistency", desc: "30-day streak", earned: false, progress: 28, total: 30,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Arjun K.", avatar: "AK", xp: 2847, trend: 2, badge: "🥇" },
  { rank: 2, name: "Priya S.", avatar: "PS", xp: 2721, trend: 0, badge: "🥈" },
  { rank: 3, name: "Rohan M.", avatar: "RM", xp: 2698, trend: 5, badge: "🥉" },
  { rank: 4, name: "Ananya R.", avatar: "AR", xp: 2614, trend: -1, badge: "" },
  { rank: 5, name: "Dev P.", avatar: "DP", xp: 2580, trend: 3, badge: "" },
];

const ACTIVITY = [
  { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", tag: "Accepted", tagColor: "#34d399", tagBg: "rgba(16,185,129,0.12)", title: "Two Sum", sub: "Easy · Arrays", time: "2h ago" },
  { icon: Play, color: "#6366f1", bg: "rgba(99,102,241,0.1)", tag: "Watched", tagColor: "#a5b4fc", tagBg: "rgba(99,102,241,0.12)", title: "Binary Trees — Module 4", sub: "DSA Course · Video lecture", time: "4h ago" },
  { icon: Trophy, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", tag: "Rank #89", tagColor: "#fcd34d", tagBg: "rgba(245,158,11,0.12)", title: "Weekly Contest #47", sub: "3 problems solved", time: "1d ago" },
  { icon: ClipboardList, color: "#a855f7", bg: "rgba(168,85,247,0.1)", tag: "Full Marks", tagColor: "#d8b4fe", tagBg: "rgba(168,85,247,0.12)", title: "Arrays Homework — Set 3", sub: "15 / 15 correct", time: "2d ago" },
  { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", tag: "Accepted", tagColor: "#34d399", tagBg: "rgba(16,185,129,0.12)", title: "Maximum Subarray", sub: "Medium · Dynamic Programming", time: "2d ago" },
];

function TrendBadge({ trend }: { trend: number }) {
  if (trend > 0) return (
    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
      <ArrowUp className="w-2.5 h-2.5" />{trend}
    </span>
  );
  if (trend < 0) return (
    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-400">
      <ArrowUp className="w-2.5 h-2.5 rotate-180" />{Math.abs(trend)}
    </span>
  );
  return <Minus className="w-3 h-3" style={{ color: "#555577" }} />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [goals, setGoals] = useState([
    { id: 1, text: "Solve 5 problems", done: true },
    { id: 2, text: "Review notes", done: true },
    { id: 3, text: "Sliding window module", done: true },
    { id: 4, text: "Watch editorial", done: true },
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

  const xpPct = user ? Math.round((user.xp / user.xpMax) * 100) : 0;
  const goalsDone = goals.filter((g) => g.done).length;

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
          {/* Glow orbs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.8), transparent 65%)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.8), transparent 65%)", filter: "blur(30px)" }} />

          <div className="relative z-10 p-6 lg:p-8">
            {/* Top row */}
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
                  {user?.streak} day streak! 🔥
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)", color: "#a5b4fc" }}>
                  <Star className="w-4 h-4" />
                  Level {user?.level} · {user?.title}
                </div>
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: Zap, label: "Total XP", value: user?.xp.toLocaleString(), color: "#facc15" },
                { icon: Trophy, label: "Global Rank", value: `#${user?.rank}`, color: "#f59e0b" },
                { icon: Flame, label: "Streak", value: `${user?.streak}d`, color: "#f97316" },
                { icon: TrendingUp, label: "Contest Rating", value: user?.rating.toLocaleString(), color: "#6366f1" },
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
                <span style={{ color: "#8888aa" }}>XP Progress — Level {user?.level} → {(user?.level ?? 0) + 1}</span>
                <span className="font-semibold" style={{ color: "#a5b4fc" }}>
                  {user?.xp.toLocaleString()} / {user?.xpMax.toLocaleString()}
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
                {user?.xpMax ? (user.xpMax - user.xp).toLocaleString() : 0} XP to unlock Level {(user?.level ?? 0) + 1}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Secondary stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SECONDARY_STATS.map((s, i) => (
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
              <div className="text-lg font-bold text-white leading-tight">{s.value}</div>
              <div className="text-[10px] font-medium mt-0.5 mb-1 truncate" style={{ color: "#8888aa" }}>{s.label}</div>
              <div className="text-[10px]" style={{ color: s.color }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Main content grid ── */}
        <div className="grid xl:grid-cols-3 gap-6">

          {/* Left 2/3 */}
          <div className="xl:col-span-2 space-y-6">

            {/* Activity heatmap — circular cells */}
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
                  {Array.from({ length: 52 }, (_, w) => (
                    <div key={w} className="flex flex-col gap-0.5">
                      {Array.from({ length: 7 }, (_, d) => (
                        <div
                          key={d}
                          className="w-2.5 h-2.5 rounded-full transition-transform duration-100 hover:scale-125 cursor-pointer"
                          style={{ background: HEATMAP_COLORS[HEATMAP[w * 7 + d]] }}
                          title={`Week ${w + 1}, Day ${d + 1}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {[
                  { label: "Total Days", value: "364" },
                  { label: "Active Days", value: "185" },
                  { label: "Current Streak", value: `${user?.streak}d` },
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
              <div className="space-y-2">
                {ACTIVITY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05, duration: 0.35 }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors cursor-pointer group"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: item.bg }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-[11px] truncate" style={{ color: "#8888aa" }}>{item.sub}</p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-1 rounded-lg font-semibold shrink-0"
                      style={{ background: item.tagBg, color: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                    <span className="text-[10px] shrink-0 ml-1" style={{ color: "#555577" }}>
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-5">

            {/* Daily goals — green theme */}
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
              {/* Glow */}
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

                {/* Progress bar */}
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
                  {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {ACHIEVEMENTS.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: a.earned ? a.bg : "rgba(255,255,255,0.02)",
                      border: `1px solid ${a.earned ? a.border : "rgba(255,255,255,0.06)"}`,
                      opacity: a.earned ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = a.earned ? "1" : "0.6";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: a.earned ? a.bg : "rgba(255,255,255,0.04)", border: `1px solid ${a.border}` }}
                    >
                      {a.earned
                        ? <a.icon className="w-4 h-4" style={{ color: a.color }} />
                        : <Lock className="w-4 h-4" style={{ color: "#555577" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{a.title}</p>
                      <p className="text-[10px]" style={{ color: "#8888aa" }}>{a.desc}</p>
                      {!a.earned && "progress" in a && (
                        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${((a.progress ?? 0) / (a.total ?? 1)) * 100}%`, background: a.color }}
                          />
                        </div>
                      )}
                    </div>
                    {a.earned
                      ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: a.color }} />
                      : "progress" in a
                        ? <span className="text-[10px] shrink-0 font-mono" style={{ color: "#555577" }}>{a.progress}/{a.total}</span>
                        : <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "#555577" }} />
                    }
                  </div>
                ))}
              </div>
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
              <div className="space-y-1.5">
                {LEADERBOARD.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors hover:bg-white/3 cursor-pointer"
                  >
                    <span
                      className="w-5 text-center text-xs font-bold shrink-0"
                      style={{ color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "#555577" }}
                    >
                      {u.badge || u.rank}
                    </span>
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                    >
                      {u.avatar}
                    </div>
                    <span className="text-xs font-medium text-white flex-1 truncate">{u.name}</span>
                    <TrendBadge trend={u.trend} />
                    <span className="text-xs font-semibold shrink-0" style={{ color: "#a5b4fc" }}>
                      {u.xp.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Current user */}
                <div
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl mt-2"
                  style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <span className="w-5 text-center text-xs font-bold text-indigo-400 shrink-0">142</span>
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
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400 shrink-0">
                    <ArrowUp className="w-2.5 h-2.5" />38
                  </span>
                  <span className="text-xs font-semibold text-indigo-400 shrink-0">
                    {user?.rating.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </>
  );
}
