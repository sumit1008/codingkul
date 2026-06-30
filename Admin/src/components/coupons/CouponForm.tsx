"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { couponSchema, type CouponInput } from "@/validations/schemas";
import { COURSE_TIERS } from "@/types";

export default function CouponForm({ couponId }: { couponId?: string }) {
  const router = useRouter();
  const isEdit = !!couponId;

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<CouponInput>({
      resolver: zodResolver(couponSchema),
      defaultValues: {
        discountType: "PERCENTAGE",
        applicableCourses: [],
        validityDays: 30,
        maxUsageCount: 100,
        isDisabled: false,
      },
    });

  const discountType = watch("discountType");

  useEffect(() => {
    if (!couponId) return;
    fetch(`/api/coupons/${couponId}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        const c = j.data.coupon;
        setValue("code", c.code);
        setValue("description", c.description ?? "");
        setValue("discountType", c.discountType);
        setValue("discountValue", c.discountValue);
        setValue("applicableCourses", c.applicableCourses);
        setValue("validityDays", c.validityDays);
        setValue("maxUsageCount", c.maxUsageCount);
        setValue("isDisabled", c.isDisabled);
      });
  }, [couponId, setValue]);

  const onSubmit = async (data: CouponInput) => {
    try {
      const url    = isEdit ? `/api/coupons/${couponId}` : "/api/coupons";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      router.push(isEdit ? `/dashboard/coupons/${couponId}` : "/dashboard/coupons");
    } catch { toast.error("Network error"); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
      <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Coupon Code *</label>
            <input {...register("code")} className="input font-mono uppercase" placeholder="WELCOME50" />
            {errors.code && <p className="text-danger text-xs mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="label">Validity (days from creation) *</label>
            <input {...register("validityDays")} type="number" min={1} className="input" placeholder="30" />
            {errors.validityDays && <p className="text-danger text-xs mt-1">{errors.validityDays.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register("description")} className="input min-h-20 resize-y" placeholder="Optional internal note about this coupon…" rows={2} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Discount Type *</label>
            <div className="flex gap-2">
              {(["PERCENTAGE", "FIXED"] as const).map((t) => (
                <label
                  key={t}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium cursor-pointer border transition-colors ${
                    discountType === t ? "text-white bg-primary/20 border-primary/40" : "text-text-muted border-white/[0.08] hover:bg-white/[0.04]"
                  }`}
                >
                  <input type="radio" value={t} {...register("discountType")} className="hidden" />
                  {t === "PERCENTAGE" ? "Percentage (%)" : "Fixed Amount (₹)"}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Discount Value *</label>
            <input {...register("discountValue")} type="number" min={1} max={discountType === "PERCENTAGE" ? 100 : undefined} className="input" placeholder={discountType === "PERCENTAGE" ? "10" : "500"} />
            {errors.discountValue && <p className="text-danger text-xs mt-1">{errors.discountValue.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Maximum Usage Count *</label>
          <input {...register("maxUsageCount")} type="number" min={1} className="input" placeholder="100" />
          <p className="text-xs text-text-faint mt-1">Coupon automatically expires after this many successful purchases.</p>
          {errors.maxUsageCount && <p className="text-danger text-xs mt-1">{errors.maxUsageCount.message}</p>}
        </div>

        <div>
          <label className="label">Applicable Courses *</label>
          <Controller
            name="applicableCourses"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                {COURSE_TIERS.map((course) => {
                  const checked = field.value?.includes(course) ?? false;
                  return (
                    <label key={course} className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value ?? []), course]
                            : (field.value ?? []).filter((c) => c !== course);
                          field.onChange(next);
                        }}
                        className="w-4 h-4 accent-indigo-500"
                      />
                      {course}
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.applicableCourses && <p className="text-danger text-xs mt-1">{errors.applicableCourses.message as string}</p>}
        </div>

        {isEdit && (
          <div className="flex items-center gap-3">
            <input {...register("isDisabled")} type="checkbox" id="isDisabled" className="w-4 h-4 accent-indigo-500" />
            <label htmlFor="isDisabled" className="text-sm text-text-muted">Disabled (manually turned off, hidden from checkout)</label>
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()} className="btn-ghost flex-1">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save Changes" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
