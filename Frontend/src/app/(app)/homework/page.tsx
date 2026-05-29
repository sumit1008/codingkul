"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import HomeworkCard from "@/components/batch/HomeworkCard";
import { useAllHomework, useUpdateAnyHomeworkProgress } from "@/hooks/useBatch";
import type { HomeworkStatus, HomeworkWithBatch } from "@/types/batch";

const TABS: { label: string; value: HomeworkStatus | "all" }[] = [
  { label: "All",         value: "all" },
  { label: "Pending",     value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
  { label: "Overdue",     value: "overdue" },
];

const TAB_COLOR: Record<string, string> = {
  all:           "#6366f1",
  pending:       "#6366f1",
  "in-progress": "#22d3ee",
  completed:     "#22c55e",
  overdue:       "#ef4444",
};

const STAT_ICONS = {
  total:     <BookOpen className="w-4 h-4" />,
  pending:   <Clock className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  overdue:   <AlertCircle className="w-4 h-4" />,
};

export default function AllHomeworkPage() {
  const { data: homework, isLoading, isError } = useAllHomework();
  const { mutate: updateProgress, isPending, variables } = useUpdateAnyHomeworkProgress();
  const [activeTab, setActiveTab]     = useState<HomeworkStatus | "all">("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");

  const batches = useMemo(() => {
    if (!homework) return [];
    const seen = new Map<string, string>();
    homework.forEach((h) => { if (h.batchSlug) seen.set(h.batchSlug, h.batchTitle); });
    return Array.from(seen.entries()).map(([slug, title]) => ({ slug, title }));
  }, [homework]);

  const filtered = useMemo(() => {
    if (!homework) return [];
    let list = homework;
    if (batchFilter !== "all") list = list.filter((h) => h.batchSlug === batchFilter);
    if (activeTab !== "all") list = list.filter((h) => h.status === activeTab);
    return list;
  }, [homework, activeTab, batchFilter]);

  const counts = useMemo(() => {
    const base = batchFilter !== "all" ? (homework ?? []).filter((h) => h.batchSlug === batchFilter) : (homework ?? []);
    return base.reduce<Record<string, number>>((acc, h) => {
      acc[h.status] = (acc[h.status] ?? 0) + 1;
      acc.all = (acc.all ?? 0) + 1;
      return acc;
    }, {});
  }, [homework, batchFilter]);

  function handleStatusChange(hw: HomeworkWithBatch, status: HomeworkStatus) {
    updateProgress({ hwId: hw._id, batchSlug: hw.batchSlug, status });
  }

  return (
    <div className="min-h-screen" style={{ background: "#060612" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Homework</h1>
          <p className="text-sm text-[#8888aa]">All assignments across your enrolled batches</p>
        </div>

        {/* Stats bar */}
        {homework && homework.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {(["total", "pending", "completed", "overdue"] as const).map((key) => {
              const count = key === "total" ? (counts.all ?? 0) : (counts[key] ?? 0);
              const colors: Record<string, string> = {
                total:     "#6366f1",
                pending:   "#8888aa",
                completed: "#22c55e",
                overdue:   "#ef4444",
              };
              const color = colors[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span style={{ color }}>{STAT_ICONS[key]}</span>
                  <div>
                    <p className="text-lg font-bold text-white leading-none">{count}</p>
                    <p className="text-xs text-[#8888aa] capitalize mt-0.5">{key}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Batch filter */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-[#8888aa] font-medium">Batch:</span>
            {[{ slug: "all", title: "All Batches" }, ...batches].map((b) => (
              <button
                key={b.slug}
                onClick={() => setBatchFilter(b.slug)}
                className="px-3 py-1 rounded-xl text-xs font-semibold transition-all"
                style={
                  batchFilter === b.slug
                    ? { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
                    : { background: "rgba(255,255,255,0.04)", color: "#8888aa", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {b.title}
              </button>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = counts[tab.value] ?? 0;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
                style={
                  isActive
                    ? { background: `${TAB_COLOR[tab.value]}18`, color: TAB_COLOR[tab.value], border: `1px solid ${TAB_COLOR[tab.value]}30` }
                    : { color: "#8888aa" }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
                    style={isActive ? { background: `${TAB_COLOR[tab.value]}25`, color: TAB_COLOR[tab.value] } : { background: "rgba(255,255,255,0.08)", color: "#8888aa" }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#6366f1]" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(99,102,241,0.1)" }}>
              <BookOpen className="w-7 h-7 text-[#6366f1]" />
            </div>
            <p className="text-white font-semibold text-lg mb-1">Batch access required</p>
            <p className="text-sm text-[#8888aa] max-w-xs">Homework is available to Foundation, Accelerator, and Placement students. Upgrade your plan to get started.</p>
            <Link
              href="/courses"
              className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
            >
              View Plans
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-10 h-10 text-[#333355] mb-3" />
            <p className="text-[#8888aa] font-medium">No homework here</p>
            <p className="text-sm text-[#555577] mt-1">
              {activeTab === "all" ? "You have no assignments yet." : `No ${activeTab} assignments.`}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((hw) => (
                <div key={hw._id} className="relative">
                  {/* Batch badge */}
                  {hw.batchSlug && (
                    <div className="mb-2">
                      <Link
                        href={`/batch/${hw.batchSlug}/homework`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-opacity hover:opacity-70"
                        style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
                      >
                        <BookOpen className="w-3 h-3" />
                        {hw.batchTitle}
                      </Link>
                    </div>
                  )}
                  <HomeworkCard
                    hw={hw}
                    onStatusChange={(hwId, status) => handleStatusChange(hw, status)}
                    loading={isPending && variables?.hwId === hw._id}
                  />
                </div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
