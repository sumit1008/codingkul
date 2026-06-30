"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

interface Props {
  percentage: number;
  onComplete: () => void;
}

const DISMISS_KEY = "ck_profile_banner_dismissed";

export default function ProfileCompletionBanner({ percentage, onComplete }: Props) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  if (percentage >= 100 || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-4 mb-6"
      style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))", border: "1px solid rgba(99,102,241,0.25)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.2)" }}>
        <Sparkles className="w-5 h-5" style={{ color: "#a5b4fc" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-semibold text-white">Complete Your Profile</p>
          <span className="text-xs font-semibold" style={{ color: "#a5b4fc" }}>{percentage}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
          />
        </div>
      </div>

      <button
        onClick={onComplete}
        className="px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0 hover:scale-[1.03] transition-transform"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
      >
        Complete Now
      </button>

      <button onClick={handleDismiss} className="p-1.5 rounded-lg shrink-0 hover:bg-white/5 transition-colors" style={{ color: "#8888aa" }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
