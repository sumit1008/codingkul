"use client";

import { use, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import BatchNav from "@/components/batch/BatchNav";
import HomeworkCard from "@/components/batch/HomeworkCard";
import { useBatchHomework, useUpdateHomeworkProgress } from "@/hooks/useBatch";
import type { HomeworkStatus } from "@/types/batch";

const TABS: { label: string; value: HomeworkStatus | "all" }[] = [
  { label: "All",         value: "all" },
  { label: "Pending",     value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
  { label: "Overdue",     value: "overdue" },
];

const TAB_COLOR: Record<string, string> = {
  "all":         "#6366f1",
  "pending":     "#6366f1",
  "in-progress": "#22d3ee",
  "completed":   "#22c55e",
  "overdue":     "#ef4444",
};

export default function HomeworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: homework, isLoading } = useBatchHomework(slug);
  const { mutate: updateProgress, isPending } = useUpdateHomeworkProgress(slug);
  const [activeTab, setActiveTab] = useState<HomeworkStatus | "all">("all");

  const filtered = useMemo(() => {
    if (!homework) return [];
    if (activeTab === "all") return homework;
    return homework.filter((h) => h.status === activeTab);
  }, [homework, activeTab]);

  const counts = useMemo(() => {
    if (!homework) return {} as Record<string, number>;
    return homework.reduce<Record<string, number>>((acc, h) => {
      acc[h.status] = (acc[h.status] ?? 0) + 1;
      acc.all = (acc.all ?? 0) + 1;
      return acc;
    }, {});
  }, [homework]);

  function handleStatusChange(hwId: string, status: HomeworkStatus) {
    updateProgress({ hwId, status });
  }

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Homework</h1>
            <p className="text-sm text-[#8888aa] mt-1">
              {homework?.filter((h) => h.status === "completed").length ?? 0}/{homework?.length ?? 0} completed
            </p>
          </div>
        </div>

        <div className="mb-6">
          <BatchNav slug={slug} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = counts[tab.value] ?? 0;
            const color = TAB_COLOR[tab.value];
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
                style={
                  isActive
                    ? { background: `${color}18`, border: `1px solid ${color}40`, color }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#7878a0" }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={isActive ? { background: `${color}25`, color } : { background: "rgba(255,255,255,0.08)", color: "#7878a0" }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText className="w-10 h-10 text-[#8888aa] opacity-30" />
            <p className="text-sm text-[#8888aa]">
              {activeTab === "all" ? "No homework assigned yet" : `No ${activeTab} homework`}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((hw) => (
                <motion.div
                  key={hw._id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <HomeworkCard
                    hw={hw}
                    onStatusChange={handleStatusChange}
                    loading={isPending}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
