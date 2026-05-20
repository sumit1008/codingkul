"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { sheetSchema, type SheetInput } from "@/validations/schemas";
import { slugify } from "@/lib/utils";
import type { Sheet } from "@/types";

interface Props { sheet: Sheet | null; onClose: () => void; onSaved: () => void; }

export default function SheetForm({ sheet, onClose, onSaved }: Props) {
  const isEdit = !!sheet;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<SheetInput>({
      resolver: zodResolver(sheetSchema),
      defaultValues: sheet
        ? {
            title:       sheet.title,
            slug:        sheet.slug,
            description: sheet.description,
            thumbnail:   sheet.thumbnail,
            isPublished: sheet.isPublished,
            isPremium:   sheet.isPremium,
            order:       sheet.order,
            accentColor: sheet.accentColor,
            accentFrom:  sheet.accentFrom,
            accentTo:    sheet.accentTo,
          }
        : { isPublished: false, isPremium: false, order: 0, accentColor: "#6366f1", accentFrom: "#6366f1", accentTo: "#a855f7" },
    });

  const titleVal = watch("title");
  useEffect(() => {
    if (!isEdit && titleVal) setValue("slug", slugify(titleVal));
  }, [titleVal, isEdit, setValue]);

  const onSubmit = async (data: SheetInput) => {
    try {
      const url    = isEdit ? `/api/sheets/${sheet._id}` : "/api/sheets";
      const method = isEdit ? "PUT" : "POST";
      const r      = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Sheet updated" : "Sheet created");
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
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <h2 className="text-base font-semibold text-text">{isEdit ? "Edit Sheet" : "New Sheet"}</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Title *</label>
                <input {...register("title")} className="input" placeholder="Master DSA Sheet" />
                {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="label">Slug *</label>
                <input {...register("slug")} className="input font-mono text-sm" placeholder="master-dsa-sheet" />
                {errors.slug && <p className="text-danger text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="label">Description</label>
                <textarea {...register("description")} rows={2} className="input resize-none" placeholder="Brief description…" />
              </div>

              <div className="col-span-2">
                <label className="label">Thumbnail URL</label>
                <input {...register("thumbnail")} className="input" placeholder="https://…" />
                {errors.thumbnail && <p className="text-danger text-xs mt-1">{errors.thumbnail.message}</p>}
              </div>

              <div>
                <label className="label">Order</label>
                <input {...register("order", { valueAsNumber: true })} type="number" min={0} className="input" />
              </div>

              <div>
                <label className="label">Accent Color</label>
                <input {...register("accentColor")} type="color" className="h-11 w-full rounded-xl border border-white/[0.08] bg-bg-elevated cursor-pointer" />
              </div>

              <div>
                <label className="label">Gradient From</label>
                <input {...register("accentFrom")} type="color" className="h-11 w-full rounded-xl border border-white/[0.08] bg-bg-elevated cursor-pointer" />
              </div>

              <div>
                <label className="label">Gradient To</label>
                <input {...register("accentTo")} type="color" className="h-11 w-full rounded-xl border border-white/[0.08] bg-bg-elevated cursor-pointer" />
              </div>

              <div className="flex items-center gap-3">
                <input {...register("isPublished")} type="checkbox" id="pub" className="w-4 h-4 rounded accent-primary" />
                <label htmlFor="pub" className="text-sm text-text-muted cursor-pointer">Published</label>
              </div>

              <div className="flex items-center gap-3">
                <input {...register("isPremium")} type="checkbox" id="prem" className="w-4 h-4 rounded accent-primary" />
                <label htmlFor="prem" className="text-sm text-text-muted cursor-pointer">Premium only</label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEdit ? "Save Changes" : "Create Sheet"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
