"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import type { AnalyticsData } from "@/types";

const DIFF_COLORS = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
const TOPIC_COLOR = "#6366f1";

export default function Charts() {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const diffData = data
    ? [
        { name: "Easy",   count: data.difficultyBreakdown.Easy,   fill: DIFF_COLORS.Easy },
        { name: "Medium", count: data.difficultyBreakdown.Medium, fill: DIFF_COLORS.Medium },
        { name: "Hard",   count: data.difficultyBreakdown.Hard,   fill: DIFF_COLORS.Hard },
      ]
    : [];

  const platformData = data?.platformBreakdown ?? [];

  const skeletonStyle = {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    height: "200px",
    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Difficulty Distribution */}
      <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text mb-5">Difficulty Distribution</h3>
        {loading ? (
          <div style={skeletonStyle} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={diffData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {diffData.map((d, i) => <Cell key={i} fill={d.fill} stroke="transparent" />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e8e8f4" }}
              />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#8888aa", fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Topics */}
      <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text mb-5">Top Topics</h3>
        {loading ? (
          <div style={skeletonStyle} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={(data?.topicBreakdown ?? []).slice(0, 7)} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="topic" tick={{ fill: "#8888aa", fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e8e8f4" }}
              />
              <Bar dataKey="count" fill={TOPIC_COLOR} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Platform Breakdown */}
      <div className="rounded-2xl p-6 lg:col-span-2" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text mb-5">Platform Breakdown</h3>
        {loading ? (
          <div style={{ ...skeletonStyle, height: "180px" }} />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformData}>
              <XAxis dataKey="platform" tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e8e8f4" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {platformData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${220 + i * 30},70%,65%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
