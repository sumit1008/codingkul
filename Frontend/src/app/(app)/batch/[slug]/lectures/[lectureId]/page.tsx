"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle, Paperclip,
  ExternalLink, Clock, BookOpen, Loader2, ArrowLeft, Video,
} from "lucide-react";
import Link from "next/link";
import { useLecture, useToggleLecture } from "@/hooks/useBatch";

export default function LectureDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lectureId: string }>;
}) {
  const { slug, lectureId } = use(params);
  const { data, isLoading } = useLecture(slug, lectureId);
  const toggle = useToggleLecture(slug);
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    setToggling(true);
    try {
      await toggle.mutateAsync(lectureId);
    } finally {
      setToggling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05050f" }}>
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (!data?.lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05050f" }}>
        <div className="text-center">
          <p className="text-base font-bold text-white mb-2">Lecture not found</p>
          <Link href={`/batch/${slug}/lectures`} className="text-sm text-[#6366f1] hover:underline">
            Back to lectures
          </Link>
        </div>
      </div>
    );
  }

  const { lecture, prev, next, isCompleted } = data;

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-sm text-[#8888aa]">
          <Link href={`/batch/${slug}/lectures`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Lectures
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{lecture.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: video + info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Video embed */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ aspectRatio: "16/9", background: "#0a0a1a", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              {lecture.youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${lecture.youtubeVideoId}?rel=0&modestbranding=1`}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Video className="w-10 h-10 text-[#6366f1] opacity-40" />
                  <p className="text-sm text-[#8888aa]">Video not available</p>
                </div>
              )}
            </motion.div>

            {/* Title + completion */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-extrabold text-white leading-snug">{lecture.title}</h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-[#8888aa]">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {lecture.module}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {lecture.duration} min
                  </span>
                  {lecture.isLiveClassRecording && (
                    <span className="text-[#ef4444] font-semibold">🔴 Recording</span>
                  )}
                </div>
              </div>

              <button
                onClick={handleToggle}
                disabled={toggling}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex-shrink-0"
                style={
                  isCompleted
                    ? { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }
                    : { background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }
                }
              >
                {toggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {isCompleted ? "Completed" : "Mark Done"}
              </button>
            </motion.div>

            {/* Description */}
            {lecture.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.18 }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h2 className="text-sm font-bold text-white mb-2">About this lecture</h2>
                <p className="text-sm text-[#a8a8c0] leading-relaxed whitespace-pre-line">{lecture.description}</p>
              </motion.div>
            )}

            {/* Attachments */}
            {lecture.attachments?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.22 }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#a855f7]" />
                  Resources
                </h2>
                <div className="flex flex-col gap-2">
                  {lecture.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 group transition-all hover:bg-white/[0.04]"
                      style={{ border: "1px solid rgba(168,85,247,0.2)" }}
                    >
                      <span className="text-sm text-[#a8a8c0] group-hover:text-white transition-colors truncate">{att.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#a855f7] flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prev / Next navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.26 }}
              className="flex items-center gap-3 pt-2"
            >
              {prev ? (
                <Link
                  href={`/batch/${slug}/lectures/${prev._id}`}
                  className="flex-1 flex items-center gap-2 rounded-xl px-4 py-3 group transition-all hover:bg-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <ChevronLeft className="w-4 h-4 text-[#8888aa] group-hover:text-white transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#6666aa] uppercase tracking-wider mb-0.5">Previous</p>
                    <p className="text-sm font-medium text-[#a8a8c0] group-hover:text-white transition-colors truncate">{prev.title}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {next ? (
                <Link
                  href={`/batch/${slug}/lectures/${next._id}`}
                  className="flex-1 flex items-center justify-end gap-2 rounded-xl px-4 py-3 group transition-all hover:bg-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] text-[#6666aa] uppercase tracking-wider mb-0.5">Next</p>
                    <p className="text-sm font-medium text-[#a8a8c0] group-hover:text-white transition-colors truncate">{next.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8888aa] group-hover:text-white transition-colors flex-shrink-0" />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Homework linked to this lecture */}
            {(lecture as any).homeworkIds?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}
              >
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  📋 Homework
                </h2>
                <div className="flex flex-col gap-2">
                  {(lecture as any).homeworkIds.map((hw: any) => (
                    <Link
                      key={hw._id}
                      href={`/batch/${slug}/homework`}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.04]"
                      style={{ border: "1px solid rgba(245,158,11,0.12)" }}
                    >
                      <p className="text-sm text-[#a8a8c0] truncate">{hw.title}</p>
                      <span className="text-xs font-bold text-[#a855f7] flex-shrink-0">+{hw.xpReward} XP</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Lecture info card */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-sm font-bold text-white">Lecture Info</h2>
              <InfoRow label="Module" value={lecture.module} />
              <InfoRow label="Duration" value={`${lecture.duration} min`} />
              {lecture.isLiveClassRecording && <InfoRow label="Type" value="🔴 Live Recording" />}
              {lecture.unlockAt && (
                <InfoRow
                  label="Unlocked"
                  value={new Date(lecture.unlockAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                />
              )}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#8888aa]">Status</span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-[#6666aa]">Not started</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#8888aa]">{label}</span>
      <span className="text-xs font-medium text-[#a8a8c0]">{value}</span>
    </div>
  );
}
