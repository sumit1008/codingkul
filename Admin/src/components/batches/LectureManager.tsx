"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Save, X, Video, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { lectureSchema, type LectureInput } from "@/validations/schemas";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import type { AdminBatch, AdminLecture } from "@/types";

interface Props { batch: AdminBatch; }

function toDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

function LectureForm({
  lecture, batchId, onClose, onSaved,
}: {
  lecture: AdminLecture | null;
  batchId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!lecture;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LectureInput>({
    resolver: zodResolver(lectureSchema),
    defaultValues: lecture
      ? {
          title:                lecture.title,
          module:               lecture.module,
          description:          lecture.description,
          youtubeVideoId:       lecture.youtubeVideoId,
          duration:             lecture.duration,
          order:                lecture.order,
          unlockAt:             toDatetimeLocal(lecture.unlockAt),
          isLiveClassRecording: lecture.isLiveClassRecording,
        }
      : { description: "", unlockAt: "", isLiveClassRecording: false, duration: 30, order: 0 },
  });

  const onSubmit = async (data: LectureInput) => {
    try {
      const url    = isEdit ? `/api/batches/${batchId}/lectures/${lecture._id}` : `/api/batches/${batchId}/lectures`;
      const method = isEdit ? "PUT" : "POST";
      const r      = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j      = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Lecture updated" : "Lecture created");
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
            <h2 className="text-base font-semibold text-text">{isEdit ? "Edit Lecture" : "New Lecture"}</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="label">Title *</label>
              <input {...register("title")} className="input" placeholder="Introduction to Arrays" />
              {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Module *</label>
                <input {...register("module")} className="input" placeholder="Arrays & Strings" />
                {errors.module && <p className="text-danger text-xs mt-1">{errors.module.message}</p>}
              </div>
              <div>
                <label className="label">YouTube Video ID *</label>
                <input {...register("youtubeVideoId")} className="input font-mono text-sm" placeholder="dQw4w9WgXcQ" />
                {errors.youtubeVideoId && <p className="text-danger text-xs mt-1">{errors.youtubeVideoId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Duration (minutes)</label>
                <input {...register("duration", { valueAsNumber: true })} type="number" min={1} className="input" />
                {errors.duration && <p className="text-danger text-xs mt-1">{errors.duration.message}</p>}
              </div>
              <div>
                <label className="label">Order</label>
                <input {...register("order", { valueAsNumber: true })} type="number" min={0} className="input" />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea {...register("description")} className="input resize-y" placeholder="Lecture notes…" rows={3} />
            </div>

            <div>
              <label className="label">Unlock At</label>
              <input {...register("unlockAt")} type="datetime-local" className="input" />
            </div>

            <div className="flex items-center gap-3">
              <input {...register("isLiveClassRecording")} type="checkbox" id="isLive" className="w-4 h-4 accent-red-500" />
              <label htmlFor="isLive" className="text-sm text-text-muted">🔴 Live class recording</label>
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

export default function LectureManager({ batch }: Props) {
  const [lectures, setLectures]     = useState<AdminLecture[]>([]);
  const [loading, setLoading]       = useState(true);
  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState<AdminLecture | null>(null);
  const [deleteTarget, setDel]      = useState<AdminLecture | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/batches/${batch._id}/lectures`);
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Failed to load lectures"); setLectures([]); return; }
      setLectures(j.data ?? []);
    } catch { toast.error("Failed to load lectures"); }
    finally { setLoading(false); }
  }, [batch._id]);

  useEffect(() => { fetchLectures(); }, [fetchLectures]);

  const handleSaved = () => { setFormOpen(false); setEditing(null); fetchLectures(); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/batches/${batch._id}/lectures/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Lecture deleted");
      setDel(null);
      fetchLectures();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
          Lectures ({lectures.length})
        </h3>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
          <Plus className="w-3.5 h-3.5" /> Add Lecture
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <div className="text-center py-10 text-text-faint text-sm">No lectures yet</div>
      ) : (
        <div className="space-y-2">
          {lectures.map((l) => (
            <div
              key={l._id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.1)" }}>
                <Video className="w-3.5 h-3.5 text-[#6366f1]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{l.title}</p>
                <p className="text-xs text-text-faint">{l.module} · <Clock className="w-3 h-3 inline" /> {l.duration}min · #{l.order}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(l); setFormOpen(true); }}
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDel(l)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <LectureForm
          lecture={editing}
          batchId={batch._id}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Lecture"
        description={`Delete "${deleteTarget?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
