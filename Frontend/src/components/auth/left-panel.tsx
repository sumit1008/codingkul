"use client";

import { motion } from "framer-motion";
import { Code2, TrendingUp, Trophy, Users, CheckCircle2 } from "lucide-react";

const FEATURES = [
  "750+ handpicked DSA problems with video editorials",
  "Weekly rated contests & real leaderboards",
  "Mock interviews & placement guarantee",
];

export default function AuthLeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden h-full min-h-screen"
      style={{
        background: "linear-gradient(160deg, #080818 0%, #10052a 50%, #080818 100%)",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Purple orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.18] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.7) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      {/* Indigo orb bottom */}
      <div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-[0.12] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-10">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 mb-auto"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 0 16px rgba(99,102,241,0.5)",
            }}
          >
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg" style={{ letterSpacing: "-0.02em" }}>
            Codingkul
          </span>
        </motion.a>

        {/* Main content */}
        <div className="py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.28)",
                color: "#a5b4fc",
              }}
            >
              🚀 India&apos;s #1 DSA Platform
            </div>
            <h1
              className="text-4xl font-bold text-white leading-tight mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              Code Your Way to
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Dream Company
              </span>
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#8888aa" }}>
              Join 5,000+ students who cracked top tech companies with our structured DSA
              roadmap, live contests, and 1-on-1 mentorship.
            </p>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="rounded-2xl p-5 mb-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(99,102,241,0.18)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-white">Platform overview</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: "5K+", label: "Students" },
                { value: "750+", label: "Problems" },
                { value: "2K+", label: "Placements" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#8888aa" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="space-y-3"
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "#aaaacc" }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
                {f}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-6 pt-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { icon: Users, value: "5K+", label: "Active students" },
            { icon: Trophy, value: "4.9/5", label: "Platform rating" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-semibold text-white">{value}</span>
              <span className="text-xs" style={{ color: "#8888aa" }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
