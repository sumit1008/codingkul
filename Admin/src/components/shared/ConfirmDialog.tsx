"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "danger" | "warning";
}

export default function ConfirmDialog({
  open, title, description, onConfirm, onCancel, loading, variant = "danger",
}: Props) {
  const color = variant === "danger" ? "#ef4444" : "#f59e0b";
  const bg    = variant === "danger" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)";
  const border= variant === "danger" ? "rgba(239,68,68,0.2)"  : "rgba(245,158,11,0.2)";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          >
            <div className="flex gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, border: `1px solid ${border}` }}>
                <AlertTriangle className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">{title}</h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onCancel} disabled={loading} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: color === "#ef4444" ? "rgba(239,68,68,0.85)" : "rgba(245,158,11,0.85)" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
