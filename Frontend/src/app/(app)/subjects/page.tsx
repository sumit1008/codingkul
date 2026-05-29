"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Network, Code2, Shield, Clock } from "lucide-react";

const SUBJECTS = [
  { icon: Cpu, label: "Operating Systems", desc: "Processes, scheduling, memory, deadlocks" },
  { icon: Database, label: "DBMS", desc: "Normalization, SQL, transactions, indexing" },
  { icon: Network, label: "Computer Networks", desc: "TCP/IP, OSI model, routing, protocols" },
  { icon: Code2, label: "OOP & Design", desc: "Patterns, SOLID principles, system design" },
  { icon: Shield, label: "Compiler Design", desc: "Lexical analysis, parsing, code generation" },
  { icon: Cpu, label: "Computer Architecture", desc: "Pipelining, cache, instruction sets" },
];

export default function SubjectsPage() {
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
            <Cpu className="w-7 h-7" style={{ color: "#22d3ee" }} />
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
          Core Subjects
        </h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: "#8888aa" }}>
          Structured theory coverage for every CS core subject — video lectures,
          notes, and practice questions all in one place.
        </p>

        {/* Subject grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {SUBJECTS.map(({ icon: Icon, label, desc }, i) => (
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
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#22d3ee" }} />
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
