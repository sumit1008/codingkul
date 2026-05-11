"use client";

import { motion } from "framer-motion";
import {
  Map,
  Swords,
  ClipboardList,
  Briefcase,
  BarChart3,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "Structured Roadmap",
    description:
      "Curated topic-by-topic DSA roadmap from zero to placement-ready. Never feel lost again.",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: Swords,
    title: "Live Contests",
    description:
      "Weekly rated contests to benchmark your progress and climb real leaderboards.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.15)",
  },
  {
    icon: ClipboardList,
    title: "Homework Tracking",
    description:
      "Auto-graded daily assignments with progress tracking across every topic.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    icon: Briefcase,
    title: "Placement Prep",
    description:
      "Company-specific mock interviews, resume reviews, and HR round preparation.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Deep insights into your solving patterns, weak areas, and daily streaks.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "10,000+ active learners. Doubt solving, peer discussions, and study groups.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.15)",
  },
];


export default function FeatureSection() {
  return (
    <section id="courses" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            Everything you need
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for serious learners
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Every feature is designed around one goal — getting you placed at
            your dream company.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-6 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${feat.color}40`;
                  el.style.boxShadow = `0 0 30px ${feat.glow}, 0 20px 60px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>

                <h3 className="text-base font-semibold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8888aa" }}>
                  {feat.description}
                </p>

                {/* Bottom gradient accent */}
                <div
                  className="absolute bottom-0 inset-x-0 h-px rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
