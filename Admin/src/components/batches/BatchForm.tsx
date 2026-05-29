"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { batchSchema, type BatchInput } from "@/validations/schemas";
import { slugify } from "@/lib/utils";
import type { AdminBatch } from "@/types";

interface Props { batch: AdminBatch | null; onClose: () => void; onSaved: () => void; }

function toDateInput(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default function BatchForm({ batch, onClose, onSaved }: Props) {
  const isEdit = !!batch;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<BatchInput>({
      resolver: zodResolver(batchSchema),
      defaultValues: batch
        ? {
            title:          batch.title,
            slug:           batch.slug,
            description:    batch.description,
            courseId:       batch.courseId ?? "",
            instructorName: batch.instructorName,
            meetLink:       batch.meetLink ?? "",
            bannerImage:    batch.bannerImage ?? "",
            startDate:      toDateInput(batch.startDate),
            endDate:        toDateInput(batch.endDate),
            isActive:       batch.isActive,
          }
        : {
            description:    "",
            courseId:       "",
            meetLink:       "",
            bannerImage:    "",
            slug:           "",
            isActive:       true,
          },
    });

  const titleVal = watch("title");
  useEffect(() => {
    if (!isEdit && titleVal) setValue("slug", slugify(titleVal));
  }, [titleVal, isEdit, setValue]);

  const onSubmit = async (data: BatchInput) => {
    try {
      const url    = isEdit ? `/api/batches/${batch._id}` : "/api/batches";
      const method = isEdit ? "PUT" : "POST";
      const r      = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Batch updated" : "Batch created");
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
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-base font-semibold text-text">{isEdit ? "Edit Batch" : "New Batch"}</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="label">Title *</label>
              <input {...register("title")} className="input" placeholder="DSA Mastery Batch 2025" />
              {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input {...register("slug")} className="input font-mono text-sm" placeholder="dsa-mastery-batch-2025" />
                {errors.slug && <p className="text-danger text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="label">Instructor Name *</label>
                <input {...register("instructorName")} className="input" placeholder="Sumit Kumar" />
                {errors.instructorName && <p className="text-danger text-xs mt-1">{errors.instructorName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea {...register("description")} className="input min-h-20 resize-y" placeholder="Batch description…" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date *</label>
                <input {...register("startDate")} type="date" className="input" />
                {errors.startDate && <p className="text-danger text-xs mt-1">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="label">End Date *</label>
                <input {...register("endDate")} type="date" className="input" />
                {errors.endDate && <p className="text-danger text-xs mt-1">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Meet Link</label>
              <input {...register("meetLink")} className="input" placeholder="https://meet.google.com/..." />
              {errors.meetLink && <p className="text-danger text-xs mt-1">{errors.meetLink.message}</p>}
            </div>

            <div>
              <label className="label">Banner Image URL</label>
              <input {...register("bannerImage")} className="input" placeholder="https://..." />
              {errors.bannerImage && <p className="text-danger text-xs mt-1">{errors.bannerImage.message}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input {...register("isActive")} type="checkbox" id="isActive" className="w-4 h-4 accent-indigo-500" />
              <label htmlFor="isActive" className="text-sm text-text-muted">Active (visible to enrolled students)</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEdit ? "Save Changes" : "Create Batch"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
