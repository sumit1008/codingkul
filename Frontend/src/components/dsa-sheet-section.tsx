"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const CHAPTERS = [
  {
    id: "01",
    title: "Arrays & Hashing",
    problems: 35,
    done: 35,
    status: "complete",
    difficulty: "Easy",
    diffColor: "#10b981",
    topics: ["Two Sum", "Group Anagrams", "Top K Elements"],
  },
  {
    id: "02",
    title: "Two Pointers",
    problems: 19,
    done: 19,
    status: "complete",
    difficulty: "Easy",
    diffColor: "#10b981",
    topics: ["Valid Palindrome", "3Sum", "Container With Water"],
  },
  {
    id: "03",
    title: "Sliding Window",
    problems: 11,
    done: 9,
    status: "active",
    difficulty: "Medium",
    diffColor: "#f59e0b",
    topics: ["Longest Substring", "Min Window Substr", "Permutation in String"],
  },
  {
    id: "04",
    title: "Binary Search",
    problems: 18,
    done: 14,
    status: "active",
    difficulty: "Medium",
    diffColor: "#f59e0b",
    topics: ["Search in 2D Matrix", "Koko Eating", "Median of Two Arrays"],
  },
  {
    id: "05",
    title: "Linked Lists",
    problems: 22,
    done: 6,
    status: "active",
    difficulty: "Medium",
    diffColor: "#f59e0b",
    topics: ["Reverse Linked List", "LRU Cache", "Merge K Lists"],
  },
  {
    id: "06",
    title: "Trees",
    problems: 30,
    done: 0,
    status: "locked",
    difficulty: "Hard",
    diffColor: "#ef4444",
    topics: ["Invert Binary Tree", "Max Depth", "Serialize/Deserialize"],
  },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "complete")
    return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  if (status === "locked") return <Lock className="w-4 h-4 text-[#8888aa]" />;
  return (
    <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
  );
}

export default function DsaSheetSection() {
  return (
    <section id="sheets" className="relative z-10 py-24 px-4">
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
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#fcd34d",
            }}
          >
            Curated Roadmap
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            DSA Sheet — Zero to Hero
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            450+ handpicked problems organized by topic and difficulty. Track
            every problem, unlock the next chapter.
          </p>
        </motion.div>

        {/* Sheet layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: chapter list */}
          <div className="lg:col-span-3 space-y-3">
            {CHAPTERS.map((chapter, i) => {
              const pct =
                chapter.problems > 0
                  ? Math.round((chapter.done / chapter.problems) * 100)
                  : 0;
              const isLocked = chapter.status === "locked";

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="group rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: isLocked
                      ? "rgba(255,255,255,0.01)"
                      : "rgba(255,255,255,0.03)",
                    border: isLocked
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "1px solid rgba(255,255,255,0.07)",
                    opacity: isLocked ? 0.5 : 1,
                    cursor: isLocked ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLocked) {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(99,102,241,0.3)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 0 20px rgba(99,102,241,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      isLocked
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Chapter number */}
                    <div
                      className="text-xs font-mono font-bold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        color: "#a5b4fc",
                      }}
                    >
                      {chapter.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-white text-sm">
                          {chapter.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{
                              background: `${chapter.diffColor}15`,
                              color: chapter.diffColor,
                            }}
                          >
                            {chapter.difficulty}
                          </span>
                          <StatusIcon status={chapter.status} />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 rounded-full bg-white/5 mb-2">
                        <div
                          className="h-1 rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background:
                              chapter.status === "complete"
                                ? "linear-gradient(90deg, #10b981, #34d399)"
                                : "linear-gradient(90deg, #6366f1, #a855f7)",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {chapter.topics.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-md"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                color: "#8888aa",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-white font-medium ml-2 flex-shrink-0">
                          {chapter.done}/{chapter.problems}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: summary panel */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 sticky top-24"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 40px rgba(99,102,241,0.05)",
              }}
            >
              <h3 className="font-semibold text-white mb-5 text-sm">
                Overall Progress
              </h3>

              {/* Big donut-style display */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#prog)"
                      strokeWidth="8"
                      strokeDasharray={`${(83 / 135) * 251} 251`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">83</span>
                    <span className="text-[10px]" style={{ color: "#8888aa" }}>
                      of 135
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-white">
                  Problems Solved
                </p>
              </div>

              {/* Difficulty breakdown */}
              <div className="space-y-3">
                {[
                  { label: "Easy", count: 54, total: 54, color: "#10b981" },
                  { label: "Medium", count: 28, total: 62, color: "#f59e0b" },
                  { label: "Hard", count: 1, total: 19, color: "#ef4444" },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: d.color }}>{d.label}</span>
                      <span className="text-white font-medium">
                        {d.count}/{d.total}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${(d.count / d.total) * 100}%`,
                          background: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
