"use client";

import { motion } from "framer-motion";
import { BookMarked, FileText, StickyNote, Search, Download, Clock } from "lucide-react";

const FEATURES = [
  { icon: FileText, label: "Topic Notes", desc: "Handcrafted notes for every DSA topic" },
  { icon: StickyNote, label: "Personal Notes", desc: "Write and save your own study notes" },
  { icon: Search, label: "Smart Search", desc: "Find any concept instantly across all notes" },
  { icon: Download, label: "PDF Export", desc: "Download notes and study offline anytime" },
];

export default function NotesPage() {
  return (
    <div
      className="min-h-full flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#050510" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 0 32px rgba(99,102,241,0.15)",
            }}
          >
            <BookMarked className="w-7 h-7" style={{ color: "#a855f7" }} />
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>

        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Notes
        </h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: "#8888aa" }}>
          Your personal knowledge base for DSA. Curated topic notes, personal annotations,
          and everything you need to revise fast.
        </p>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: "easeOut" }}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#a855f7" }} />
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#8888aa" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
