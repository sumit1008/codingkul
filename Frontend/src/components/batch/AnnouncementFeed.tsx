"use client";

import { motion } from "framer-motion";
import { Pin, Megaphone } from "lucide-react";
import type { Announcement } from "@/types/batch";

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementFeed({ announcements }: Props) {
  if (!announcements.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Megaphone className="w-10 h-10 text-[#8888aa] opacity-30" />
        <p className="text-sm text-[#8888aa]">No announcements yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {announcements.map((ann, i) => (
        <motion.div
          key={ann._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="rounded-2xl p-5"
          style={{
            background: ann.isPinned ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.025)",
            border: ann.isPinned ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: ann.isPinned ? "0 0 20px rgba(168,85,247,0.06)" : "none",
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {ann.isPinned && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold text-[#a855f7] bg-[rgba(168,85,247,0.12)]">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              <h3 className="font-semibold text-white text-sm">{ann.title}</h3>
            </div>
            <span className="text-xs text-[#8888aa] flex-shrink-0">{formatRelative(ann.createdAt)}</span>
          </div>
          <p className="text-sm text-[#a8a8c0] leading-relaxed whitespace-pre-line">{ann.content}</p>
        </motion.div>
      ))}
    </div>
  );
}
