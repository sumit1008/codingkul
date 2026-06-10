"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Lock, Play, FileText, ChevronDown, ChevronUp,
  Check, Sparkles, BookOpen, Clock, Users, Star,
} from "lucide-react";
import { Course } from "@/types/course";
import UpgradeModal from "@/components/courses/UpgradeModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const LECTURE_ICON: Record<string, React.ReactNode> = {
  video: <Play className="w-3.5 h-3.5" />,
  practice: <FileText className="w-3.5 h-3.5" />,
  interview: <Users className="w-3.5 h-3.5" />,
  workshop: <Star className="w-3.5 h-3.5" />,
};

const SLUG_COLORS: Record<string, { border: string; btn: string; badge: string; glow: string }> = {
  foundation: {
    border: "rgba(34,197,94,0.3)",
    btn: "linear-gradient(135deg, #15803d, #166534)",
    badge: "#22c55e",
    glow: "rgba(34,197,94,0.08)",
  },
  accelerator: {
    border: "rgba(234,179,8,0.35)",
    btn: "linear-gradient(135deg, #854d0e, #92400e)",
    badge: "#eab308",
    glow: "rgba(234,179,8,0.08)",
  },
  placement: {
    border: "rgba(168,85,247,0.3)",
    btn: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    badge: "#a855f7",
    glow: "rgba(168,85,247,0.08)",
  },
};

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedClickMsg, setLockedClickMsg] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`${API}/courses/${slug}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setCourse(data.data.course);
        setExpandedModules(new Set([0]));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleLockedLecture = () => {
    setLockedClickMsg("Purchase this course to unlock all lectures.");
    setTimeout(() => setLockedClickMsg(null), 3000);
    setShowUpgradeModal(true);
  };

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

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white text-lg">Course not found.</p>
        <button
          onClick={() => router.push("/courses")}
          className="text-sm px-4 py-2 rounded-xl"
          style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const c = SLUG_COLORS[course.slug] ?? SLUG_COLORS.foundation;
  const hasAccess = course.hasAccess;

  return (
    <div className="min-h-screen p-6" style={{ background: "#050510" }}>
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/courses")}
          className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
          style={{ color: "#8888aa" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6 flex items-center justify-between gap-4 flex-wrap"
          style={{
            background: `linear-gradient(135deg, ${c.glow.replace("0.08", "0.18")}, rgba(10,10,22,0.95))`,
            border: `1px solid ${c.border}`,
            boxShadow: `0 0 40px ${c.glow}`,
          }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{course.title}</h1>
            <p className="text-sm mb-3" style={{ color: "#aaaacc" }}>{course.tagline}</p>
            <div className="flex items-baseline gap-2">
              {hasAccess ? (
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
                >
                  <Check className="w-3.5 h-3.5" /> Enrolled
                </span>
              ) : (
                <span className="text-3xl font-bold" style={{ color: c.badge }}>
                  ₹{(course.upgradePrice ?? course.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          {!hasAccess && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="h-11 px-6 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] shrink-0"
              style={{ background: c.btn }}
            >
              {course.upgradePrice !== null && course.upgradePrice !== course.price
                ? `Upgrade for ₹${course.upgradePrice.toLocaleString()}`
                : `Buy Now — ₹${course.price.toLocaleString()}`}
            </button>
          )}
          {hasAccess && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}
            >
              <Sparkles className="w-4 h-4" />
              Premium Access Active
            </div>
          )}
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: <BookOpen className="w-4 h-4" />, label: "Modules", value: course.modules.length, color: c.badge },
            { icon: <Clock className="w-4 h-4" />, label: "Total Hours", value: course.modules.reduce((acc, m) => acc + parseInt(m.duration), 0) + "+", color: "#22d3ee" },
            { icon: <FileText className="w-4 h-4" />, label: "Lectures", value: course.modules.reduce((acc, m) => acc + m.lectures.length, 0), color: "#a855f7" },
            { icon: <Users className="w-4 h-4" />, label: "Validity", value: course.validity[0].split(" ").slice(0, 2).join(" "), color: "#22c55e" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "rgba(14,14,30,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs" style={{ color: "#8888aa" }}>{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Course Content */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>

          {/* Locked banner */}
          {!hasAccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl p-4 mb-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <Lock className="w-5 h-5 shrink-0" style={{ color: "#a5b4fc" }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Content Locked</p>
                <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
                  Purchase this course to unlock all lectures, practice sets, and resources.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="shrink-0 text-xs px-4 py-2 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{ background: c.btn, color: "#fff" }}
              >
                Unlock Now
              </button>
            </motion.div>
          )}

          <div className="space-y-3">
            {course.modules.map((module, mIdx) => {
              const isExpanded = expandedModules.has(mIdx);
              return (
                <div
                  key={module.title}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(14,14,30,0.6)" }}
                >
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(mIdx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-white">{module.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>{module.duration}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!hasAccess && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                        >
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" style={{ color: "#8888aa" }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: "#8888aa" }} />
                      )}
                    </div>
                  </button>

                  {/* Lectures */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          {module.lectures.map((lecture, lIdx) => (
                            <div
                              key={lecture.title}
                              className={`flex items-center gap-3 px-5 py-3 transition-colors ${hasAccess ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-pointer hover:bg-white/[0.02]"}`}
                              style={{
                                borderBottom: lIdx < module.lectures.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                              }}
                              onClick={hasAccess ? undefined : handleLockedLecture}
                            >
                              {/* Icon */}
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                  background: hasAccess ? `${c.glow}` : "rgba(255,255,255,0.03)",
                                  border: `1px solid ${hasAccess ? c.border : "rgba(255,255,255,0.06)"}`,
                                  color: hasAccess ? c.badge : "#555577",
                                }}
                              >
                                {hasAccess ? LECTURE_ICON[lecture.type] ?? LECTURE_ICON.video : <Lock className="w-3 h-3" />}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm truncate"
                                  style={{ color: hasAccess ? "#e8e8f0" : "#666688" }}
                                >
                                  {lecture.title}
                                </p>
                                <p className="text-xs" style={{ color: "#555577" }}>{lecture.duration}</p>
                              </div>

                              {/* Right: lock or preview icon */}
                              <div style={{ color: hasAccess ? "#555577" : "#333355" }}>
                                {hasAccess ? (
                                  <Play className="w-3.5 h-3.5" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Upgrade CTA between modules (only when locked) */}
                          {!hasAccess && (
                            <div
                              className="mx-4 my-3 p-3 rounded-xl flex items-center justify-between gap-3"
                              style={{
                                background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.04))",
                                border: "1px solid rgba(99,102,241,0.15)",
                              }}
                            >
                              <p className="text-xs" style={{ color: "#8888aa" }}>
                                Purchase to unlock full course
                              </p>
                              <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="text-xs px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap"
                                style={{ background: c.btn, color: "#fff" }}
                              >
                                Unlock
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked lecture toast */}
        <AnimatePresence>
          {lockedClickMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium text-white z-50"
              style={{
                background: "rgba(15,15,30,0.95)",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: "#a5b4fc" }} />
                {lockedClickMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && course && (
        <UpgradeModal
          course={course}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
}
