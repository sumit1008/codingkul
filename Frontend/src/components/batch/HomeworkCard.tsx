"use client";

import { motion } from "framer-motion";
import { Clock, Zap, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import type { Homework, HomeworkStatus } from "@/types/batch";

const STATUS_CONFIG: Record<HomeworkStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:     { label: "Pending",     color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)"  },
  "in-progress":{ label: "In Progress", color: "#22d3ee", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)"  },
  completed:   { label: "Completed",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.2)"   },
  overdue:     { label: "Overdue",     color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)"  },
};

const DIFF_COLOR: Record<string, string> = {
  Easy:   "#22c55e",
  Medium: "#f59e0b",
  Hard:   "#ef4444",
};

interface Props {
  hw: Homework;
  onStatusChange?: (hwId: string, status: HomeworkStatus) => void;
  loading?: boolean;
}

function daysUntil(date: string) {
  const d = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  return `Due in ${d}d`;
}

export default function HomeworkCard({ hw, onStatusChange, loading }: Props) {
  const cfg = STATUS_CONFIG[hw.status];
  const isOverdue = hw.status === "overdue";
  const isCompleted = hw.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-5"
      style={{
        background: isOverdue ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${cfg.border}`,
        boxShadow: isOverdue ? "0 0 16px rgba(239,68,68,0.06)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold border"
              style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
            >
              {cfg.label}
            </span>
            {hw.isMandatory && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-[#f59e0b] bg-[rgba(245,158,11,0.1)]">
                Mandatory
              </span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ color: DIFF_COLOR[hw.difficulty], background: `${DIFF_COLOR[hw.difficulty]}18` }}
            >
              {hw.difficulty}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug">{hw.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-[#a855f7]" />
          <span className="text-xs font-bold text-[#a855f7]">+{hw.xpReward} XP</span>
        </div>
      </div>

      {/* Due date + solved count */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#8888aa]" />
          <span className={`text-xs font-medium ${isOverdue ? "text-[#ef4444]" : "text-[#8888aa]"}`}>
            {daysUntil(hw.dueDate)}
          </span>
        </div>
        <div className="text-xs text-[#8888aa]">
          {hw.problems.length} problems  ·  {hw.solvedCount}/{hw.problems.length} solved
        </div>
      </div>

      {/* Problems */}
      {hw.problems.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-4">
          {hw.problems.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: DIFF_COLOR[p.difficulty] ?? "#8888aa" }}
              />
              <span className="text-xs text-[#a8a8c0] flex-1 truncate">{p.title}</span>
              <span className="text-[10px] text-[#6666aa] flex-shrink-0">{p.platform}</span>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-3 h-3 text-[#6366f1]" />
                </a>
              )}
            </div>
          ))}
          {hw.problems.length > 3 && (
            <p className="text-xs text-[#6666aa]">+{hw.problems.length - 3} more problems</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      {onStatusChange && !isCompleted && (
        <div className="flex gap-2">
          {hw.status === "pending" && (
            <button
              disabled={loading}
              onClick={() => onStatusChange(hw._id, "in-progress")}
              className="flex-1 h-8 rounded-xl text-xs font-semibold text-[#22d3ee] transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              Start
            </button>
          )}
          <button
            disabled={loading}
            onClick={() => onStatusChange(hw._id, "completed")}
            className="flex-1 h-8 rounded-xl text-xs font-semibold text-[#22c55e] transition-all hover:opacity-80 disabled:opacity-40 flex items-center justify-center gap-1"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center gap-2 mt-1">
          <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          <span className="text-xs text-[#22c55e] font-medium">
            Completed {hw.completedAt ? new Date(hw.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
          </span>
        </div>
      )}

      {isOverdue && hw.status !== "completed" && (
        <div className="flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4 text-[#ef4444]" />
          <span className="text-xs text-[#ef4444] font-medium">Deadline passed — still submit for partial credit</span>
        </div>
      )}
    </motion.div>
  );
}
