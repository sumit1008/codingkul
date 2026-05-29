"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import { Video, Lock, CheckCircle2, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useBatchLectures } from "@/hooks/useBatch";
import BatchNav from "@/components/batch/BatchNav";
import type { Lecture } from "@/types/batch";

function LectureRow({ lecture, index, slug }: { lecture: Lecture; index: number; slug: string }) {
  const isLocked = !lecture.isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      {isLocked ? (
        <div
          className="flex items-center gap-4 rounded-xl px-4 py-3.5 cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(136,136,170,0.1)" }}>
            <Lock className="w-4 h-4 text-[#8888aa]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#8888aa] truncate">{lecture.title}</p>
            <p className="text-xs text-[#6666aa]">
              Unlocks {new Date(lecture.unlockAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          </div>
          <span className="text-xs text-[#8888aa]">{lecture.duration}min</span>
        </div>
      ) : (
        <Link
          href={`/batch/${slug}/lectures/${lecture._id}`}
          className="flex items-center gap-4 rounded-xl px-4 py-3.5 group transition-all hover:bg-white/[0.04]"
          style={{
            background: lecture.isCompleted ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.025)",
            border: lecture.isCompleted ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: lecture.isCompleted ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.1)" }}
          >
            {lecture.isCompleted
              ? <CheckCircle2 className="w-4.5 h-4.5 text-[#22c55e]" style={{ width: 18, height: 18 }} />
              : <Video className="w-4.5 h-4.5 text-[#6366f1]" style={{ width: 18, height: 18 }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-[#a5b4fc] transition-colors">{lecture.title}</p>
            <p className="text-xs text-[#8888aa]">
              {lecture.module}
              {lecture.isLiveClassRecording && " · 🔴 Recording"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-xs text-[#8888aa]">
            <Clock className="w-3 h-3" />{lecture.duration}min
          </div>
          {lecture.isCompleted && (
            <span className="text-xs text-[#22c55e] ml-2 hidden sm:inline">✓ Done</span>
          )}
        </Link>
      )}
    </motion.div>
  );
}

export default function LecturesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: lectures, isLoading } = useBatchLectures(slug);

  const grouped = useMemo(() => {
    if (!lectures) return {};
    return lectures.reduce<Record<string, Lecture[]>>((acc, l) => {
      const mod = l.module || "General";
      if (!acc[mod]) acc[mod] = [];
      acc[mod].push(l);
      return acc;
    }, {});
  }, [lectures]);

  const totalWatched = lectures?.filter((l) => l.isCompleted).length ?? 0;
  const total = lectures?.length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Lectures</h1>
            <p className="text-sm text-[#8888aa] mt-1">{totalWatched}/{total} completed</p>
          </div>
        </div>

        <div className="mb-6">
          <BatchNav slug={slug} />
        </div>

        {/* Module-wise progress bar */}
        {total > 0 && (
          <div className="mb-6 rounded-2xl p-4" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#a5b4fc] font-semibold">Overall Progress</span>
              <span className="text-xs font-bold text-white">{total > 0 ? Math.round((totalWatched / total) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (totalWatched / total) * 100 : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
          </div>
        ) : Object.entries(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Video className="w-10 h-10 text-[#8888aa] opacity-30" />
            <p className="text-sm text-[#8888aa]">No lectures yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([module, lecs]) => {
              const done = lecs.filter((l) => l.isCompleted).length;
              return (
                <section key={module}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#a5b4fc] uppercase tracking-wider">{module}</h2>
                    <span className="text-xs text-[#8888aa]">{done}/{lecs.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {lecs.map((l, i) => (
                      <LectureRow key={l._id} lecture={l} index={i} slug={slug} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
