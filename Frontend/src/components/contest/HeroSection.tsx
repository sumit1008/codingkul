"use client";

import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import StatsCards from "./StatsCards";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-10">
      {/* ── Background effects ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Centre radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.14) 0%, transparent 70%)",
          }}
        />
        {/* Top-right purple orb */}
        <div
          className="absolute -top-24 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)" }}
        />
        {/* Bottom-left cyan orb */}
        <div
          className="absolute bottom-0 -left-16 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%)" }}
        />
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.25,
          }}
        />
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            boxShadow: "0 0 24px rgba(99,102,241,0.12)",
          }}
        >
          <Swords className="w-3.5 h-3.5" />
          Compete &amp; Conquer
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 leading-none"
        >
          <span style={{ color: "#ffffff" }}>Contest </span>
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Arena
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#7878a0" }}
        >
          Participate in weekly contests, improve problem-solving skills, and
          climb academy rankings.
        </motion.p>

        {/* Stats Cards */}
        <StatsCards />
      </div>
    </section>
  );
}
