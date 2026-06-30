"use client";

import { useState } from "react";
import { Tag, X, Check, Loader2, AlertCircle } from "lucide-react";
import type { CouponValidationResult } from "@/types/coupon";

interface Props {
  appliedCoupon: CouponValidationResult | null;
  applying: boolean;
  error: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  accentColor?: string;
}

export default function CouponInput({ appliedCoupon, applying, error, onApply, onRemove, accentColor = "#7c3aed" }: Props) {
  const [code, setCode] = useState("");

  if (appliedCoupon) {
    return (
      <div
        className="flex items-center justify-between gap-2 rounded-xl p-3 mb-4"
        style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.15)" }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{appliedCoupon.code} applied</p>
            <p className="text-xs" style={{ color: "#22c55e" }}>Coupon Applied Successfully</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-text-muted hover:bg-white/10 transition-colors shrink-0"
          style={{ color: "#8888aa" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555577" }}>
        Have a Coupon?
      </p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#555577" }} />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onApply(code); } }}
            placeholder="Coupon Code"
            disabled={applying}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-sm text-white bg-white/[0.03] border outline-none transition-colors disabled:opacity-60"
            style={{ borderColor: error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)" }}
          />
        </div>
        <button
          onClick={() => onApply(code)}
          disabled={applying || !code.trim()}
          className="h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          style={{ background: accentColor }}
        >
          {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs mt-2" style={{ color: "#ef4444" }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
