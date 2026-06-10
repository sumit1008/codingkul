"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap, Flame, Star, Check, X, Lock, Eye, ArrowRight,
  Trophy, Target, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  useAuth,
  getHighestPurchasedTier,
  PRODUCT_TIER_RANK,
  PRODUCT_TIER_LABELS,
} from "@/lib/auth-context";
import { Course } from "@/types/course";
import UpgradeModal from "@/components/courses/UpgradeModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


const ROADMAP = [
  { month: 1, title: "Fundamentals", tags: ["Arrays", "Strings", "Mathematics"], advanced: false },
  { month: 2, title: "Window + Searching", tags: ["Sliding Window", "Binary Search"], advanced: false },
  { month: 3, title: "STL + Recursion", tags: ["Standard Template Library", "Recursive Solutions"], advanced: false },
  { month: 4, title: "Data Structures", tags: ["Trees", "Heaps", "Hash Maps"], advanced: false },
  { month: 5, title: "Graphs", tags: ["BFS", "DFS", "Shortest Paths"], advanced: false },
  { month: 6, title: "Dynamic Programming", tags: ["Memoization", "Tabulation", "Advanced DP"], advanced: true },
];

const COMPARE_ROWS = [
  { feature: "Live DSA Classes", foundation: true, accelerator: true, placement: true },
  { feature: "240+ Hours Content", foundation: true, accelerator: true, placement: true },
  { feature: "DSA Sheet Access", foundation: true, accelerator: true, placement: true },
  { feature: "Weekly Assignments", foundation: true, accelerator: true, placement: true },
  { feature: "Ranked Contests", foundation: false, accelerator: true, placement: true },
  { feature: "Personal Mentor", foundation: false, accelerator: true, placement: true },
  { feature: "Monthly 1-on-1 Reviews", foundation: false, accelerator: true, placement: true },
  { feature: "Core Subjects (OS, DBMS, CN)", foundation: false, accelerator: false, placement: true },
  { feature: "Mock Interviews", foundation: false, accelerator: false, placement: true },
  { feature: "Resume Optimization", foundation: false, accelerator: false, placement: true },
  { feature: "Placement Guidance", foundation: false, accelerator: false, placement: true },
  { feature: "SQL Interview Prep", foundation: false, accelerator: false, placement: true },
];

/**
 * Returns only the courses that should be visible for the user's tier:
 * - No purchase    → all 3 cards
 * - Foundation     → Foundation (Purchased) + Accelerator (Upgrade)
 * - Accelerator    → Accelerator (Purchased) + Placement (Upgrade)
 * - Placement      → Placement (Purchased) only
 */
function getVisibleCourses(courses: Course[], highestTier: string | null): Course[] {
  if (!highestTier) return courses;
  const rank = PRODUCT_TIER_RANK[highestTier] ?? 0;
  return courses.filter((c) => {
    const cr = PRODUCT_TIER_RANK[c.slug] ?? 0;
    return cr === rank || cr === rank + 1;
  });
}

interface CourseCardProps {
  course: Course;
  onUpgrade: (course: Course) => void;
}

function CourseCard({ course, onUpgrade }: CourseCardProps) {
  const router = useRouter();
  const isEnrolled = course.hasAccess;

  const tierColor: Record<string, { border: string; glow: string; badge: string; btn: string; btnText: string }> = {
    foundation: {
      border: "rgba(34,197,94,0.35)",
      glow: "rgba(34,197,94,0.12)",
      badge: "#22c55e",
      btn: "linear-gradient(135deg, #15803d, #166534)",
      btnText: "#22c55e",
    },
    accelerator: {
      border: "rgba(234,179,8,0.45)",
      glow: "rgba(234,179,8,0.1)",
      badge: "#eab308",
      btn: "linear-gradient(135deg, #854d0e, #92400e)",
      btnText: "#eab308",
    },
    placement: {
      border: "rgba(168,85,247,0.35)",
      glow: "rgba(168,85,247,0.1)",
      badge: "#a855f7",
      btn: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      btnText: "#c084fc",
    },
  };

  const c = tierColor[course.slug] ?? tierColor.foundation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col rounded-2xl h-full"
      style={{
        background: "linear-gradient(160deg, rgba(14,14,30,0.9), rgba(10,10,22,0.95))",
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 30px ${c.glow}, 0 4px 24px rgba(0,0,0,0.5)`,
        marginTop: course.badge ? "14px" : "0",
      }}
    >
      {/* Badge — sits above the card top edge */}
      {course.badge && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
          style={{ top: "-14px", background: "#0d0d20", border: `1px solid ${c.badge}`, color: c.badge, zIndex: 10 }}
        >
          {course.badge === "MOST POPULAR" && <Star className="w-3 h-3 fill-current" />}
          {course.badge === "PREMIUM" && <Flame className="w-3 h-3" />}
          {course.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Title + Price */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
          {isEnrolled ? (
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2"
              style={{ background: `${c.glow}`, border: `1px solid ${c.border}`, color: c.badge }}
            >
              <Check className="w-3.5 h-3.5" /> Purchased
            </div>
          ) : course.upgradePrice !== null && course.upgradePrice < course.price ? (
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
            >
              <Sparkles className="w-3 h-3" />
              Save ₹{(course.price - course.upgradePrice).toLocaleString()} on upgrade
            </div>
          ) : null}
          {!isEnrolled && (
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-bold" style={{ color: c.badge }}>
                ₹{(course.upgradePrice ?? course.price).toLocaleString()}
              </span>
              {course.upgradePrice !== null && course.upgradePrice < course.price && (
                <span className="text-base line-through" style={{ color: "#555577" }}>
                  ₹{course.price.toLocaleString()}
                </span>
              )}
              <span className="text-sm" style={{ color: "#8888aa" }}>one-time</span>
            </div>
          )}
        </div>

        {/* Target */}
        <div
          className="p-3 rounded-xl mb-4 text-sm leading-relaxed"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#aaaacc" }}
        >
          {course.target}
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-4 flex-1">
          {course.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#ccccdd" }}>
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c.badge }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Validity */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555577" }}>Validity</p>
          {course.validity.map((v) => (
            <p key={v} className="text-sm" style={{ color: "#8888aa" }}>• {v}</p>
          ))}
        </div>

        {/* Outcome */}
        {course.outcome && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#555577" }}>Outcome</p>
            <p className="text-sm font-medium" style={{ color: c.badge }}>{course.outcome}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-2 mt-auto">
          {isEnrolled ? (
            <>
              <button
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: c.btn }}
              >
                Continue Learning <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8888aa" }}
              >
                <Eye className="w-4 h-4" /> View Course
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onUpgrade(course)}
                className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: c.btn }}
              >
                {course.upgradePrice !== null && course.upgradePrice < course.price
                  ? `Upgrade — ₹${course.upgradePrice.toLocaleString()}`
                  : `Enroll — ₹${course.price.toLocaleString()}`}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8888aa" }}
              >
                <Eye className="w-4 h-4" /> View Course
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RightSidebar() {
  const { user } = useAuth();
  const highestTier = getHighestPurchasedTier(user);

  const xpToNext = (user?.xpMax ?? 5000) - (user?.xp ?? 0);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(14,14,30,0.95), rgba(10,10,22,0.98))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-white">Your Progress</span>
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: "#eab308" }}>
          {(user?.xp ?? 0).toLocaleString()} <span className="text-lg">XP</span>
        </div>
        <p className="text-xs mb-3" style={{ color: "#8888aa" }}>
          Level {user?.level ?? 1} · {xpToNext.toLocaleString()} XP to Level {(user?.level ?? 1) + 1}
        </p>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, ((user?.xp ?? 0) / (user?.xpMax ?? 5000)) * 100)}%`,
              background: "linear-gradient(90deg, #eab308, #f97316)",
            }}
          />
        </div>
      </div>

      {/* Daily Goals */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(14,14,30,0.95), rgba(10,10,22,0.98))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4" style={{ color: "#22d3ee" }} />
          <span className="text-sm font-bold text-white">Daily Goals</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: "#aaaacc" }}>Solve 3 problems</span>
              <span style={{ color: "#22c55e" }}>2/3</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: "66%", background: "#22c55e" }} />
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: "#aaaacc" }}>Attend 1 class</span>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: "#aaaacc" }}>Earn 100 XP</span>
              <span style={{ color: "#eab308" }}>85/100</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: "85%", background: "linear-gradient(90deg, #eab308, #f97316)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(14,14,30,0.95), rgba(10,10,22,0.98))",
          border: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-white">Current Streak</span>
        </div>
        <div className="text-4xl font-bold" style={{ color: "#f97316" }}>
          {user?.streak ?? 0}
        </div>
        <p className="text-xs mt-1" style={{ color: "#8888aa" }}>days in a row 🔥</p>
      </div>

      {/* Subscription Status */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.06))",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4" style={{ color: "#a5b4fc" }} />
          <span className="text-sm font-bold text-white">Subscription</span>
        </div>
        {!highestTier ? (
          <p className="text-xs mt-1" style={{ color: "#555577" }}>No active plan — browse below to enroll</p>
        ) : (
          <>
            <p className="text-base font-semibold" style={{ color: "#a5b4fc" }}>
              {PRODUCT_TIER_LABELS[highestTier]}
            </p>
            <p className="text-xs mt-1" style={{ color: "#22c55e" }}>Active ✓</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradeTarget, setUpgradeTarget] = useState<Course | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(true);

  // Derived from auth context — no extra state needed
  const highestTier = getHighestPurchasedTier(user);
  const visible = getVisibleCourses(courses, highestTier);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/courses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setCourses(data.data.courses);
    } catch {
      // courses remain empty; loading ends
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "#6366f1" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#050510" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Learning Platform
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Courses</h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#8888aa" }}>
            Structured programs designed to take students from beginner to placement-ready.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          {/* Left: Content */}
          <div className="space-y-10">
            {/* Course cards — visibility driven by tier hierarchy */}
            {(() => {
              const count = visible.length;
              const maxW = count === 1 ? "520px" : count === 2 ? "420px" : "360px";
              return (
                <div
                  className="flex flex-wrap justify-center gap-6 pt-4"
                >
                  {visible.map((course) => (
                    <div
                      key={course.slug}
                      className="flex-1"
                      style={{ minWidth: "280px", maxWidth: maxW }}
                    >
                      <CourseCard course={course} onUpgrade={setUpgradeTarget} />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Course Comparison */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Course Comparison</h2>
              <p className="text-sm mb-6" style={{ color: "#8888aa" }}>Compare features across all programs</p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Header row */}
                <div
                  className="grid grid-cols-4 text-xs font-bold uppercase tracking-widest px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div style={{ color: "#555577" }}>Feature</div>
                  <div className="text-center" style={{ color: "#22c55e" }}>Foundation</div>
                  <div className="text-center" style={{ color: "#eab308" }}>Accelerator</div>
                  <div className="text-center" style={{ color: "#a855f7" }}>Placement</div>
                </div>
                {COMPARE_ROWS.map((row, i) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-4 px-4 py-3 text-sm"
                    style={{
                      borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <div style={{ color: "#aaaacc" }}>{row.feature}</div>
                    <div className="flex justify-center">
                      {row.foundation ? (
                        <Check className="w-4 h-4" style={{ color: "#22c55e" }} />
                      ) : (
                        <X className="w-4 h-4" style={{ color: "#333355" }} />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {row.accelerator ? (
                        <Check className="w-4 h-4" style={{ color: "#eab308" }} />
                      ) : (
                        <X className="w-4 h-4" style={{ color: "#333355" }} />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {row.placement ? (
                        <Check className="w-4 h-4" style={{ color: "#a855f7" }} />
                      ) : (
                        <X className="w-4 h-4" style={{ color: "#333355" }} />
                      )}
                    </div>
                  </div>
                ))}
                {/* Price row */}
                <div
                  className="grid grid-cols-4 px-4 py-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                >
                  <div />
                  <div className="text-center">
                    <span className="text-lg font-bold" style={{ color: "#22c55e" }}>₹4,999</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold" style={{ color: "#eab308" }}>₹6,999</span>
                    <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>Most Popular</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold" style={{ color: "#a855f7" }}>₹9,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Roadmap */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-white">Learning Roadmap</h2>
                  <p className="text-sm mt-1" style={{ color: "#8888aa" }}>6-month structured journey from basics to advanced</p>
                </div>
                <button
                  onClick={() => setShowRoadmap((p) => !p)}
                  className="p-2 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: "#8888aa" }}
                >
                  {showRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showRoadmap && (
                <div className="relative mt-6 pl-8">
                  {/* Vertical line */}
                  <div
                    className="absolute left-3 top-3 bottom-3 w-px"
                    style={{ background: "linear-gradient(to bottom, #22d3ee, #a855f7)" }}
                  />

                  <div className="space-y-4">
                    {ROADMAP.map((item, idx) => (
                      <motion.div
                        key={item.month}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="relative"
                      >
                        {/* Dot */}
                        <div
                          className="absolute -left-[21px] top-3.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            background: "#050510",
                            borderColor: item.advanced ? "#a855f7" : "#22d3ee",
                            boxShadow: `0 0 8px ${item.advanced ? "rgba(168,85,247,0.5)" : "rgba(34,211,238,0.4)"}`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: item.advanced ? "#a855f7" : "#22d3ee" }}
                          />
                        </div>

                        <div
                          className="rounded-xl p-4"
                          style={{
                            background: "rgba(14,14,30,0.6)",
                            border: `1px solid ${item.advanced ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm" style={{ color: "#555577" }}>Month {item.month}</span>
                            <span className="text-base font-bold text-white">{item.title}</span>
                            {item.advanced && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}
                              >
                                Advanced
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-3 py-1 rounded-full"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#8888aa" }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "⌨", label: "Industry Expert Mentors", desc: "Learn from professionals working at top tech companies", color: "#22d3ee" },
                { icon: "✨", label: "Gamified Learning", desc: "Stay motivated with XP, streaks, and achievement systems", color: "#a855f7" },
                { icon: "🎯", label: "Placement Ready", desc: "Comprehensive preparation for top tech company interviews", color: "#22c55e" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(14,14,30,0.6)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                    style={{ background: `${f.color}1a`, border: `1px solid ${f.color}30` }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888aa" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {upgradeTarget && (
        <UpgradeModal
          course={upgradeTarget}
          onClose={() => setUpgradeTarget(null)}
        />
      )}
    </div>
  );
}
