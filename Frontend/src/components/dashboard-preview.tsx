"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Trophy, Flame, Activity } from "lucide-react";

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const HEATMAP_DATA = Array.from({ length: 52 * 7 }, (_, i) => {
  const r = seededRand(i);
  if (r > 0.7) return 3;
  if (r > 0.5) return 2;
  if (r > 0.35) return 1;
  return 0;
});

function HeatmapCell({ value }: { value: number }) {
  const colors = [
    "rgba(255,255,255,0.05)",
    "rgba(99,102,241,0.3)",
    "rgba(99,102,241,0.6)",
    "rgba(99,102,241,0.9)",
  ];
  return (
    <div
      className="w-2.5 h-2.5 rounded-sm"
      style={{ background: colors[value] }}
    />
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}25` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="text-xs mb-1" style={{ color: "#8888aa" }}>
          {label}
        </div>
        <div className="text-xl font-bold text-white leading-tight">{value}</div>
        <div className="text-[10px] mt-0.5" style={{ color: "#8888aa" }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

const TOPICS = [
  { name: "Arrays & Hashing", done: 35, total: 35, color: "#10b981" },
  { name: "Two Pointers", done: 19, total: 19, color: "#10b981" },
  { name: "Binary Search", done: 14, total: 18, color: "#6366f1" },
  { name: "Sliding Window", done: 9, total: 11, color: "#6366f1" },
  { name: "Linked Lists", done: 11, total: 22, color: "#a855f7" },
  { name: "Trees", done: 8, total: 30, color: "#f59e0b" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#6ee7b7",
            }}
          >
            Real-time Analytics
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Your progress, visualized
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            A powerful dashboard that shows exactly where you stand and what to
            tackle next.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow:
              "0 0 60px rgba(99,102,241,0.1), 0 40px 100px rgba(0,0,0,0.5)",
          }}
        >
          {/* Browser chrome bar */}
          <div
            className="flex items-center gap-3 px-6 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex gap-1.5">
              {["#ef4444", "#fbbf24", "#10b981"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div
              className="flex-1 max-w-sm mx-auto text-xs rounded-lg px-3 py-1.5 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#8888aa",
              }}
            >
              app.codingkul.com/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 flex gap-5">
            {/* Sidebar */}
            <div
              className="hidden lg:flex flex-col gap-1 w-44 flex-shrink-0 rounded-2xl p-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {[
                "Overview",
                "Problems",
                "Contests",
                "Progress",
                "Community",
              ].map((item, i) => (
                <div
                  key={item}
                  className="text-xs px-3 py-2 rounded-lg font-medium"
                  style={{
                    background:
                      i === 0 ? "rgba(99,102,241,0.15)" : "transparent",
                    color: i === 0 ? "#a5b4fc" : "#8888aa",
                    border:
                      i === 0
                        ? "1px solid rgba(99,102,241,0.2)"
                        : "1px solid transparent",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main dashboard area */}
            <div className="flex-1 space-y-4 min-w-0">
              {/* Stat cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                  icon={CheckCircle2}
                  label="Solved"
                  value="487"
                  sub="Total problems"
                  color="#10b981"
                />
                <StatCard
                  icon={Trophy}
                  label="Rank"
                  value="#142"
                  sub="Global contest"
                  color="#f59e0b"
                />
                <StatCard
                  icon={Flame}
                  label="Streak"
                  value="28d"
                  sub="Current streak"
                  color="#f97316"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Rating"
                  value="1847"
                  sub="Contest rating"
                  color="#6366f1"
                />
              </div>

              {/* Topic progress */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">
                    Topic Progress
                  </span>
                </div>
                <div className="space-y-3">
                  {TOPICS.map((topic) => {
                    const pct = Math.round((topic.done / topic.total) * 100);
                    return (
                      <div key={topic.name}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color: "#aaaacc" }}>{topic.name}</span>
                          <span className="text-white font-medium">
                            {topic.done}/{topic.total}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, ${topic.color}, ${topic.color}88)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Heatmap */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-sm font-semibold text-white mb-4">
                  Activity Heatmap — Last 52 weeks
                </div>
                <div
                  className="overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 52 }, (_, week) => (
                      <div key={week} className="flex flex-col gap-0.5">
                        {Array.from({ length: 7 }, (_, day) => (
                          <HeatmapCell
                            key={day}
                            value={HEATMAP_DATA[week * 7 + day]}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
