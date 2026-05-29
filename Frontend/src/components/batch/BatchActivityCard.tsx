"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, FileText, Bell, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBatchActivity } from "@/hooks/useBatch";

function Countdown({ liveAt }: { liveAt: string }) {
  const diff = new Date(liveAt).getTime() - Date.now();
  if (diff <= 0) return <span className="text-[#22c55e] font-semibold">Live now</span>;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);

  if (h >= 24) {
    const d = Math.floor(h / 24);
    return <span className="text-[#f59e0b] font-semibold">in {d}d {h % 24}h</span>;
  }
  return <span className="text-[#22c55e] font-semibold">in {h}h {m}m</span>;
}

export default function BatchActivityCard() {
  const { data: activity, isLoading } = useBatchActivity();

  if (isLoading) {
    return (
      <div
        className="rounded-2xl p-5 animate-pulse"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <div className="h-4 w-32 bg-white/[0.06] rounded mb-3" />
        <div className="h-3 w-48 bg-white/[0.04] rounded" />
      </div>
    );
  }

  if (!activity) return null;

  const hasPendingHw = activity.pendingHomework > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)",
        border: `1px solid ${hasPendingHw ? "rgba(245,158,11,0.35)" : "rgba(99,102,241,0.2)"}`,
        boxShadow: hasPendingHw ? "0 0 20px rgba(245,158,11,0.08)" : "none",
      }}
    >
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <p className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider">Active Batch</p>
          <p className="text-sm font-bold text-white mt-0.5 truncate max-w-[200px]">{activity.batch.title}</p>
        </div>
        <Link
          href={`/batch/${activity.batch.slug}`}
          className="flex items-center gap-1 text-xs text-[#a5b4fc] hover:text-white transition-colors"
        >
          View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
            <BookOpen className="w-4 h-4 text-[#6366f1]" />
          </div>
          <div>
            <p className="text-base font-bold text-white">{activity.progressPercent}%</p>
            <p className="text-xs text-[#8888aa]">Progress</p>
          </div>
        </div>

        {/* Pending HW */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: hasPendingHw ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.1)" }}
          >
            <FileText className={`w-4 h-4 ${hasPendingHw ? "text-[#f59e0b]" : "text-[#22c55e]"}`} />
          </div>
          <div>
            <p className={`text-base font-bold ${hasPendingHw ? "text-[#f59e0b]" : "text-white"}`}>{activity.pendingHomework}</p>
            <p className="text-xs text-[#8888aa]">Pending HW</p>
          </div>
        </div>

        {/* Next class */}
        {activity.nextClass && (
          <div className="col-span-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,0.1)" }}>
              <Clock className="w-4 h-4 text-[#22d3ee]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8888aa]">Next class: {activity.nextClass.title}</p>
              <Countdown liveAt={activity.nextClass.liveAt} />
            </div>
            {activity.nextClass.meetLink && (
              <a
                href={activity.nextClass.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
              >
                Join
              </a>
            )}
          </div>
        )}

        {/* Latest announcement */}
        {activity.latestAnnouncement && (
          <div className="col-span-2 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,0.1)" }}>
              <Bell className="w-4 h-4 text-[#a855f7]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#8888aa]">Latest announcement</p>
              <p className="text-sm text-white truncate">{activity.latestAnnouncement.title}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
