"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Save, X, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { homeworkSchema, type HomeworkInput } from "@/validations/schemas";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import type { AdminBatch, AdminHomework } from "@/types";

interface Props { batch: AdminBatch; }

const DIFF_COLOR: Record<string, string> = {
  Easy:   "text-[#22c55e]",
  Medium: "text-[#f59e0b]",
  Hard:   "text-[#ef4444]",
};

function HwForm({
  hw, batchId, onClose, onSaved,
}: {
  hw: AdminHomework | null;
  batchId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!hw;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HomeworkInput>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: hw
      ? {
          title:       hw.title,
          description: hw.description,
          lectureId:   hw.lectureId ?? "",
          dueDate:     new Date(hw.dueDate).toISOString().slice(0, 10),
          difficulty:  hw.difficulty,
          xpReward:    hw.xpReward,
          isMandatory: hw.isMandatory,
        }
      : { description: "", lectureId: "", difficulty: "Medium", xpReward: 50, isMandatory: false },
  });

  const onSubmit = async (data: HomeworkInput) => {
    try {
      const url    = isEdit ? `/api/batches/${batchId}/homework/${hw._id}` : `/api/batches/${batchId}/homework`;
      const method = isEdit ? "PUT" : "POST";
      const r      = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j      = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Homework updated" : "Homework created");
      onSaved();
    } catch { toast.error("Network error"); }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-2xl overflow-hidden"
          style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-base font-semibold text-text">{isEdit ? "Edit Homework" : "New Homework"}</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="label">Title *</label>
              <input {...register("title")} className="input" placeholder="Arrays — Problem Set 1" />
              {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea {...register("description")} className="input resize-y" rows={3} placeholder="Assignment notes…" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Due Date *</label>
                <input {...register("dueDate")} type="date" className="input" />
                {errors.dueDate && <p className="text-danger text-xs mt-1">{errors.dueDate.message}</p>}
              </div>
              <div>
                <label className="label">XP Reward</label>
                <input {...register("xpReward", { valueAsNumber: true })} type="number" min={0} max={1000} className="input" />
                {errors.xpReward && <p className="text-danger text-xs mt-1">{errors.xpReward.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Difficulty</label>
                <select {...register("difficulty")} className="input">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="label">Lecture ID <span className="text-text-faint">(optional)</span></label>
                <input {...register("lectureId")} className="input font-mono text-sm" placeholder="ObjectId…" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input {...register("isMandatory")} type="checkbox" id="isMandatory" className="w-4 h-4 accent-amber-500" />
              <label htmlFor="isMandatory" className="text-sm text-text-muted">Mandatory assignment</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function HomeworkManager({ batch }: Props) {
  const [homework, setHomework]     = useState<AdminHomework[]>([]);
  const [loading, setLoading]       = useState(true);
  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState<AdminHomework | null>(null);
  const [deleteTarget, setDel]      = useState<AdminHomework | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/batches/${batch._id}/homework`);
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Failed to load homework"); setHomework([]); return; }
      setHomework(j.data ?? []);
    } catch { toast.error("Failed to load homework"); }
    finally { setLoading(false); }
  }, [batch._id]);

  useEffect(() => { fetchHomework(); }, [fetchHomework]);

  const handleSaved = () => { setFormOpen(false); setEditing(null); fetchHomework(); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/batches/${batch._id}/homework/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Homework deleted");
      setDel(null);
      fetchHomework();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
          Homework ({homework.length})
        </h3>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
          <Plus className="w-3.5 h-3.5" /> Add Homework
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : homework.length === 0 ? (
        <div className="text-center py-10 text-text-faint text-sm">No homework yet</div>
      ) : (
        <div className="space-y-2">
          {homework.map((hw) => (
            <div
              key={hw._id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.1)" }}>
                <FileText className="w-3.5 h-3.5 text-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{hw.title}</p>
                <p className="text-xs text-text-faint">
                  Due {formatDate(hw.dueDate)} ·{" "}
                  <span className={DIFF_COLOR[hw.difficulty]}>{hw.difficulty}</span> ·{" "}
                  <Zap className="w-3 h-3 inline text-[#a855f7]" /> {hw.xpReward} XP ·{" "}
                  {hw.problems.length} problems
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(hw); setFormOpen(true); }}
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDel(hw)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <HwForm
          hw={editing}
          batchId={batch._id}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Homework"
        description={`Delete "${deleteTarget?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
