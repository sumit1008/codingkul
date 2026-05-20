"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Star, TrendingUp, Award } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContestStats } from "@/hooks/useContests";

const STATIC_STATS = [
  { label: "Contests Participated", value: "23",   icon: Users,      color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
  { label: "Best Rank",             value: "#8",    icon: Award,      color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { label: "Avg Rank",              value: "#24",   icon: TrendingUp, color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  { label: "Win Rate",              value: "34.8%", icon: Star,       color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
];

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-sm"
      style={{
        background: "rgba(10,10,28,0.95)",
        border: "1px solid rgba(99,102,241,0.3)",
        boxShadow: "0 0 20px rgba(99,102,241,0.15)",
      }}
    >
      <p className="text-xs mb-1" style={{ color: "#8888aa" }}>
        {label}
      </p>
      {payload.map((item) => (
        <p key={item.name} className="font-bold" style={{ color: item.color }}>
          {item.name === "rating" ? "Rating: " : "XP: "}
          {item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsCharts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const liveStats = useContestStats();

  const statCards = [
    { ...STATIC_STATS[0], value: String(liveStats.participated) },
    { ...STATIC_STATS[1], value: liveStats.bestRank ? `#${liveStats.bestRank}` : "#—" },
    { ...STATIC_STATS[2], value: liveStats.avgRank ? `#${liveStats.avgRank}` : "#—" },
    { ...STATIC_STATS[3], value: `${liveStats.winRate}%` },
  ];

  const chartRatingHistory = liveStats.ratingHistory;
  const chartXpHistory     = liveStats.xpHistory;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: "0 0 30px rgba(99,102,241,0.15)" }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: s.color, width: "18px", height: "18px" }} />
              </div>
              <div>
                <p
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: "#fff" }}
                >
                  {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
                  {s.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating line chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="mb-5">
            <h3 className="font-bold text-white text-base">Rating Progress</h3>
            <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
              Jan – May 2026
            </p>
          </div>

          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartRatingHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#8888aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8888aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 50", "dataMax + 50"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#ratingGrad)"
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#a5b4fc", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          )}
        </motion.div>

        {/* XP bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="mb-5">
            <h3 className="font-bold text-white text-base">XP Earned</h3>
            <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
              Monthly distribution
            </p>
          </div>

          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartXpHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#8888aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8888aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="xp"
                  fill="url(#xpGrad)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
