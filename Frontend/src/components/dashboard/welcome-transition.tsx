"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface WelcomeTransitionProps {
  onComplete: () => void;
}

export default function WelcomeTransition({ onComplete }: WelcomeTransitionProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const firstName = user?.name.split(" ")[0] ?? "there";

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 250);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#050510" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 0 48px rgba(99,102,241,0.55), 0 0 80px rgba(99,102,241,0.2)",
          }}
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Welcome back, {firstName}! 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-base mb-2"
          style={{ color: "#8888aa" }}
        >
          Loading your dashboard...
        </motion.p>

        {/* XP + level pill */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex items-center gap-2 text-xs mb-8 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#a5b4fc",
          }}
        >
          <Zap className="w-3 h-3 text-yellow-400" />
          Level {user?.level} · {user?.xp.toLocaleString()} XP
        </motion.div>

        {/* Progress bar */}
        <div
          className="w-64 h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              boxShadow: "0 0 10px rgba(99,102,241,0.6)",
              transition: "width 16ms linear",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
