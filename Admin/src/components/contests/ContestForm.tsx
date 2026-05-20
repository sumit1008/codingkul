"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { contestSchema, type ContestInput } from "@/validations/schemas";
import { slugify } from "@/lib/utils";
import type { AdminContest } from "@/types";

interface Props { contest: AdminContest | null; onClose: () => void; onSaved: () => void; }

function toDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export default function ContestForm({ contest, onClose, onSaved }: Props) {
  const isEdit = !!contest;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<ContestInput>({
      resolver: zodResolver(contestSchema),
      defaultValues: contest
        ? {
            title:                 contest.title,
            slug:                  contest.slug,
            codeforcesContestId:   contest.codeforcesContestId,
            codeforcesContestLink: contest.codeforcesContestLink,
            startTime:             toDatetimeLocal(contest.startTime),
            endTime:               toDatetimeLocal(contest.endTime),
            duration:              contest.duration,
            difficulty:            contest.difficulty,
            topics:                contest.topics?.join(", ") ?? "",
            xpReward:              contest.xpReward,
            status:                contest.status,
          }
        : {
            difficulty: "Intermediate",
            status:     "upcoming",
            xpReward:   200,
            duration:   "2 hours",
            topics:     "",
            slug:       "",
          },
    });

  const titleVal = watch("title");
  useEffect(() => {
    if (!isEdit && titleVal) setValue("slug", slugify(titleVal));
  }, [titleVal, isEdit, setValue]);

  const onSubmit = async (data: ContestInput) => {
    try {
      const url    = isEdit ? `/api/contests/${contest._id}` : "/api/contests";
      const method = isEdit ? "PUT" : "POST";
      const r      = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Contest updated" : "Contest created");
      onSaved();
    } catch { toast.error("Network error"); }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-base font-semibold text-text">{isEdit ? "Edit Contest" : "New Contest"}</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input {...register("title")} className="input" placeholder="AlgoShashtra Weekly #1" />
              {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="label">Slug</label>
              <input {...register("slug")} className="input font-mono text-sm" placeholder="algoshashtra-weekly-1" />
              {errors.slug && <p className="text-danger text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* CF Contest ID */}
              <div>
                <label className="label">Codeforces Contest ID *</label>
                <input
                  {...register("codeforcesContestId", { valueAsNumber: true })}
                  type="number"
                  className="input"
                  placeholder="2050"
                />
                {errors.codeforcesContestId && (
                  <p className="text-danger text-xs mt-1">{errors.codeforcesContestId.message}</p>
                )}
              </div>

              {/* XP Reward */}
              <div>
                <label className="label">XP Reward</label>
                <input
                  {...register("xpReward", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={2000}
                  className="input"
                />
                {errors.xpReward && <p className="text-danger text-xs mt-1">{errors.xpReward.message}</p>}
              </div>
            </div>

            {/* CF Link */}
            <div>
              <label className="label">Codeforces Contest Link *</label>
              <input {...register("codeforcesContestLink")} className="input" placeholder="https://codeforces.com/contest/2050" />
              {errors.codeforcesContestLink && (
                <p className="text-danger text-xs mt-1">{errors.codeforcesContestLink.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <label className="label">Start Time *</label>
                <input {...register("startTime")} type="datetime-local" className="input" />
                {errors.startTime && <p className="text-danger text-xs mt-1">{errors.startTime.message}</p>}
              </div>

              {/* End Time */}
              <div>
                <label className="label">End Time *</label>
                <input {...register("endTime")} type="datetime-local" className="input" />
                {errors.endTime && <p className="text-danger text-xs mt-1">{errors.endTime.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Duration */}
              <div>
                <label className="label">Duration</label>
                <input {...register("duration")} className="input" placeholder="2 hours" />
                {errors.duration && <p className="text-danger text-xs mt-1">{errors.duration.message}</p>}
              </div>

              {/* Difficulty */}
              <div>
                <label className="label">Difficulty</label>
                <select {...register("difficulty")} className="input">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.difficulty && <p className="text-danger text-xs mt-1">{errors.difficulty.message}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="label">Status</label>
                <select {...register("status")} className="input">
                  <option value="upcoming">Upcoming</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && <p className="text-danger text-xs mt-1">{errors.status.message}</p>}
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="label">Topics <span className="text-text-faint text-xs">(comma-separated)</span></label>
              <input {...register("topics")} className="input" placeholder="Arrays, Graphs, DP" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEdit ? "Save Changes" : "Create Contest"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
