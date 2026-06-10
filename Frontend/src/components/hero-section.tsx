"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Play,
  TrendingUp,
  CheckCircle2,
  Trophy,
  Code,
  Flame,
} from "lucide-react";

const fadeUpInit = { opacity: 0, y: 24 };
const fadeUpAnimate = { opacity: 1, y: 0 };
const fadeTrans = (delay: number) => ({ delay, duration: 0.6 });

function FloatingCard({
  children,
  className,
  delay = 0,
  floatY = 8,
  floatDuration = 4,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  floatY?: number;
  floatDuration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, floatY, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay, duration: floatDuration, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`glass rounded-2xl p-4 absolute pointer-events-none ${className}`}
      style={{ border: "1px solid rgba(99,102,241,0.2)" }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      {/* Center content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={fadeUpInit}
          animate={fadeUpAnimate}
          transition={fadeTrans(0.1)}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 0 20px rgba(99,102,241,0.1)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300">Trusted by</span>
            <span className="text-white font-semibold">5,000+ students</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={fadeUpInit}
          animate={fadeUpAnimate}
          transition={fadeTrans(0.2)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          <span className="text-white">Master </span>
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(99,102,241,0.4))",
            }}
          >
            DSA
          </span>
          <span className="text-white"> &</span>
          <br />
          <span className="text-white">Become </span>
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Placement Ready
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={fadeUpInit}
          animate={fadeUpAnimate}
          transition={fadeTrans(0.3)}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#8888aa" }}
        >
          Structured DSA roadmap, live contests, mock interviews, and placement
          mentorship — everything you need to crack top tech companies.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={fadeUpInit}
          animate={fadeUpAnimate}
          transition={fadeTrans(0.4)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="group h-12 px-8 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)";
              }}
            >
              Start Learning Free
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="group h-12 px-8 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#e8e8f0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(99,102,241,0.5)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(99,102,241,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <Play className="mr-2 w-4 h-4 text-indigo-400" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={fadeUpInit}
          animate={fadeUpAnimate}
          transition={fadeTrans(0.5)}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm"
        >
          {[
            { label: "Problems", value: "750+" },
            { label: "Live Contests", value: "Weekly" },
            { label: "Placements", value: "2,000+" },
            { label: "Rating", value: "4.9 / 5" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span style={{ color: "#8888aa" }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating cards — desktop only */}
      <div className="absolute inset-0 hidden xl:block pointer-events-none">
        {/* DSA Progress Card — top left */}
        <FloatingCard
          className="top-40 left-16 w-52"
          delay={0.6}
          floatY={10}
          floatDuration={5}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-xs font-semibold text-white">DSA Progress</span>
          </div>
          <div className="space-y-2">
            {[
              { topic: "Arrays", pct: 85 },
              { topic: "Trees", pct: 60 },
              { topic: "DP", pct: 40 },
            ].map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: "#8888aa" }}>{t.topic}</span>
                  <span className="text-white">{t.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${t.pct}%`,
                      background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </FloatingCard>

        {/* Solved problems card — bottom left */}
        <FloatingCard
          className="bottom-40 left-12 w-44"
          delay={0.7}
          floatY={-8}
          floatDuration={4.5}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Problems Solved</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">487</div>
          <div className="text-[10px]" style={{ color: "#8888aa" }}>
            +12 this week
          </div>
          <div className="mt-2 flex gap-1">
            {["E", "M", "H"].map((d, i) => (
              <span
                key={d}
                className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold"
                style={{
                  background: [
                    "rgba(52,211,153,0.15)",
                    "rgba(251,191,36,0.15)",
                    "rgba(239,68,68,0.15)",
                  ][i],
                  color: ["#34d399", "#fbbf24", "#ef4444"][i],
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </FloatingCard>

        {/* Contest ranking card — top right */}
        <FloatingCard
          className="top-40 right-16 w-48"
          delay={0.65}
          floatY={12}
          floatDuration={4.8}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-white">Contest Rank</span>
          </div>
          <div className="text-2xl font-bold text-white">#142</div>
          <div className="text-[10px] mb-3" style={{ color: "#8888aa" }}>
            Global Leaderboard
          </div>
          <div
            className="text-[10px] px-2 py-1 rounded-lg text-emerald-400"
            style={{ background: "rgba(52,211,153,0.1)" }}
          >
            ↑ 38 positions this week
          </div>
        </FloatingCard>

        {/* Code snippet — bottom right */}
        <FloatingCard
          className="bottom-40 right-12 w-56"
          delay={0.75}
          floatY={-10}
          floatDuration={5.2}
        >
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-semibold text-white font-mono">
              solution.ts
            </span>
          </div>
          <pre
            className="text-[9px] leading-relaxed font-mono overflow-hidden"
            style={{ color: "#8888aa" }}
          >
            <span style={{ color: "#a855f7" }}>function</span>{" "}
            <span style={{ color: "#22d3ee" }}>twoSum</span>
            {"(nums, target) {"}
            {"\n"}
            {"  "}
            <span style={{ color: "#a855f7" }}>const</span> map ={" "}
            <span style={{ color: "#34d399" }}>new</span> Map();
            {"\n  for (const [i, n]"}
            {"\n   of nums.entries()) {"}
            {"\n    return [map.get("}
            {"\n     target-n), i];"}
            {"\n  }}"}
          </pre>
          <div
            className="mt-2 flex items-center gap-1.5 text-[9px]"
            style={{ color: "#8888aa" }}
          >
            <Flame className="w-3 h-3 text-orange-400" />
            Streak: 28 days
          </div>
        </FloatingCard>
      </div>
    </section>
  );
}
