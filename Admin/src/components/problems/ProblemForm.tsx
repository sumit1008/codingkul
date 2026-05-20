"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { problemSchema, type ProblemInput } from "@/validations/schemas";
import { slugify } from "@/lib/utils";
import { DIFFICULTIES, PLATFORMS, TOPICS, type Sheet } from "@/types";

export default function ProblemForm({ problemId }: { problemId?: string }) {
  const router  = useRouter();
  const isEdit  = !!problemId;
  const [sheets, setSheets] = useState<Sheet[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<ProblemInput>({
      resolver: zodResolver(problemSchema),
      defaultValues: { difficulty: "Easy", platform: "LeetCode", order: 0, sheetId: null },
    });

  const titleVal = watch("title");

  // fetch sheets for dropdown
  useEffect(() => {
    fetch("/api/sheets?limit=100")
      .then((r) => r.json())
      .then((j) => setSheets(j.data?.sheets ?? []));
  }, []);

  // auto-slug
  useEffect(() => {
    if (!isEdit && titleVal) setValue("slug", slugify(titleVal));
  }, [titleVal, isEdit, setValue]);

  // load problem data if editing
  useEffect(() => {
    if (!problemId) return;
    fetch(`/api/problems/${problemId}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        const p = j.data;
        setValue("title",        p.title);
        setValue("slug",         p.slug);
        setValue("difficulty",   p.difficulty);
        setValue("topic",        p.topic);
        setValue("subtopic",     p.subtopic ?? "");
        setValue("platform",     p.platform);
        setValue("problemUrl",   p.problemUrl ?? "");
        setValue("editorialUrl", p.editorialUrl ?? "");
        setValue("videoUrl",     p.videoUrl ?? "");
        setValue("notes",        p.notes ?? "");
        setValue("tags",         (p.tags ?? []).join(", "));
        setValue("companies",    (p.companies ?? []).join(", "));
        setValue("order",        p.order ?? 0);
        setValue("sheetId",      p.sheetId ?? null);
      });
  }, [problemId, setValue]);

  const onSubmit = async (data: ProblemInput) => {
    try {
      const url    = isEdit ? `/api/problems/${problemId}` : "/api/problems";
      const method = isEdit ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sheetId: data.sheetId || null }),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Problem updated" : "Problem created");
      router.push("/dashboard/problems");
    } catch { toast.error("Network error"); }
  };

  const Field = ({ label, name, ...props }: { label: string; name: keyof ProblemInput } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="label">{label}</label>
      <input {...register(name)} {...props} className="input" />
      {errors[name] && <p className="text-danger text-xs mt-1">{errors[name]?.message as string}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
      {/* Basic Info */}
      <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Title *" name="title" placeholder="Two Sum" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Slug *</label>
            <input {...register("slug")} className="input font-mono text-sm" placeholder="two-sum" />
            {errors.slug && <p className="text-danger text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="label">Difficulty *</label>
            <select {...register("difficulty")} className="input">
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Platform</label>
            <select {...register("platform")} className="input">
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Topic *</label>
            <select {...register("topic")} className="input">
              <option value="">Select topic</option>
              {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.topic && <p className="text-danger text-xs mt-1">{errors.topic.message}</p>}
          </div>

          <div>
            <Field label="Subtopic" name="subtopic" placeholder="Prefix Sum, Two Pointer…" />
          </div>

          <div>
            <label className="label">Sheet</label>
            <select {...register("sheetId")} className="input">
              <option value="">No sheet</option>
              {sheets.map((s) => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
          </div>

          <div>
            <Field label="Order" name="order" type="number" min="0" placeholder="0" />
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Links</h3>
        <div className="space-y-3">
          <Field label="Problem URL" name="problemUrl" type="url" placeholder="https://leetcode.com/problems/…" />
          <Field label="Editorial URL" name="editorialUrl" type="url" placeholder="https://…" />
          <Field label="Video Solution URL" name="videoUrl" type="url" placeholder="https://youtube.com/…" />
        </div>
      </section>

      {/* Meta */}
      <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Tags & Notes</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Tags <span className="text-text-faint text-xs">(comma-separated)</span></label>
            <input {...register("tags")} className="input" placeholder="sliding window, hashmap" />
          </div>
          <div>
            <label className="label">Companies <span className="text-text-faint text-xs">(comma-separated)</span></label>
            <input {...register("companies")} className="input" placeholder="Google, Amazon, Meta" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea {...register("notes")} rows={4} className="input resize-none" placeholder="Key observations, approach hints…" />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()} className="btn-ghost flex-1">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save Changes" : "Create Problem"}
        </button>
      </div>
    </form>
  );
}
