"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
}

function computeTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    hours:   String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

interface Props {
  targetTimestamp: number;
}

const LABELS = ["HRS", "MIN", "SEC"];

export default function CountdownTimer({ targetTimestamp }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(targetTimestamp)
  );

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(computeTimeLeft(targetTimestamp)), 1000);
    return () => clearInterval(id);
  }, [targetTimestamp]);

  const values = [timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <div className="flex items-center gap-1.5">
      {values.map((val, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div
              className="font-mono font-bold text-2xl leading-none px-3 py-2 rounded-xl"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "#c7d2fe",
                border: "1px solid rgba(99,102,241,0.25)",
                minWidth: "3rem",
                textAlign: "center",
              }}
            >
              {val}
            </div>
            <span
              className="text-[10px] font-semibold mt-1 tracking-widest"
              style={{ color: "#6366f1" }}
            >
              {LABELS[i]}
            </span>
          </div>
          {i < 2 && (
            <span
              className="font-bold text-xl pb-4"
              style={{ color: "#6366f1" }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
