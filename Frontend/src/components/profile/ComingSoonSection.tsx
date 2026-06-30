"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function ComingSoonSection({ title, description, icon: Icon }: Props) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
        <Icon className="w-5 h-5" style={{ color: "#666688" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{title}</p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8888aa", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Coming Soon
          </span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#666688" }}>{description}</p>
      </div>
    </div>
  );
}
