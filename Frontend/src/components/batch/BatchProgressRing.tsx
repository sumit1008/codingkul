"use client";

import { motion } from "framer-motion";

interface Props {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function BatchProgressRing({
  percent,
  size = 96,
  strokeWidth = 7,
  color = "#6366f1",
  label,
}: Props) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: -(size / 2 + 8) }}>
        <span className="text-xl font-extrabold text-white" style={{ lineHeight: 1 }}>{percent}%</span>
        {label && <span className="text-[10px] text-[#8888aa] mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

// Self-contained ring with centered label
export function RingWithLabel({
  percent,
  size = 96,
  strokeWidth = 7,
  color = "#6366f1",
  label = "Done",
}: Props) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="font-extrabold text-white" style={{ fontSize: size * 0.22, lineHeight: 1 }}>{percent}%</span>
        <span style={{ fontSize: size * 0.13, color: "#8888aa", marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}
