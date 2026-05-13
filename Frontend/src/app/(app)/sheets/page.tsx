"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ChevronRight, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SHEETS, loadSolved, type Sheet } from "@/data/sheets";

// Per-sheet solved count, loaded from localStorage on client
function useSolvedCounts(userId: string) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const result: Record<string, number> = {};
    for (const sheet of SHEETS) {
      result[sheet.slug] = loadSolved(userId, sheet.slug).size;
    }
    setCounts(result);
  }, [userId]);

  return counts;
}

const DIFFICULTY_COLORS = {
  Easy: { text: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  Medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  Hard: { text: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)" },
};

function SheetCard({ sheet, solved, index }: { sheet: Sheet; solved: number; index: number }) {
  const total = sheet.problems.length;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  const easy = sheet.problems.filter((p) => p.difficulty === "Easy").length;
  const medium = sheet.problems.filter((p) => p.difficulty === "Medium").length;
  const hard = sheet.problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/sheet/${sheet.slug}`} className="block group">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300 h-full group-hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 0 0 transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${sheet.colorFrom}44`;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 32px ${sheet.colorFrom}18`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent";
          }}
        >
          {/* Gradient accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${sheet.colorFrom}, ${sheet.colorTo})` }}
          />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${sheet.colorFrom}22, ${sheet.colorTo}11)`,
                  border: `1px solid ${sheet.colorFrom}33`,
                }}
              >
                {sheet.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-base leading-tight mb-0.5 group-hover:text-indigo-300 transition-colors">
                  {sheet.title}
                </h3>
                <p className="text-xs" style={{ color: "#6677aa" }}>
                  by {sheet.author}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#8888aa" }}>
              {sheet.description}
            </p>

            {/* Topic tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sheet.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${sheet.colorFrom}18`,
                    color: sheet.accentColor,
                    border: `1px solid ${sheet.colorFrom}28`,
                  }}
                >
                  {tag}
                </span>
              ))}
              {sheet.tags.length > 4 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: "#555577", background: "rgba(255,255,255,0.04)" }}>
                  +{sheet.tags.length - 4}
                </span>
              )}
            </div>

            {/* Difficulty breakdown */}
            <div className="flex items-center gap-3 mb-4">
              {(["Easy", "Medium", "Hard"] as const).map((d) => {
                const count = d === "Easy" ? easy : d === "Medium" ? medium : hard;
                const col = DIFFICULTY_COLORS[d];
                return (
                  <div key={d} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: col.text }} />
                    <span className="text-xs font-medium" style={{ color: col.text }}>
                      {count}
                    </span>
                    <span className="text-xs" style={{ color: "#555577" }}>
                      {d}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mb-1.5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: "#8888aa" }}>
                  <span className="text-white font-semibold">{solved}</span> / {total} solved
                </span>
                <span className="font-semibold" style={{ color: sheet.accentColor }}>
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${sheet.colorFrom}, ${sheet.colorTo})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: index * 0.08 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="mx-5 mb-5 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
            style={{
              background: `linear-gradient(135deg, ${sheet.colorFrom}22, ${sheet.colorTo}11)`,
              border: `1px solid ${sheet.colorFrom}33`,
              color: sheet.accentColor,
            }}
          >
            {solved > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Continue Sheet
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Start Sheet
              </>
            )}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SheetsPage() {
  const { user } = useAuth();
  const solvedCounts = useSolvedCounts(user?.id ?? "");
  const [search, setSearch] = useState("");

  const totalProblems = SHEETS.reduce((acc, s) => acc + s.problems.length, 0);
  const totalSolved = Object.values(solvedCounts).reduce((acc, n) => acc + n, 0);

  const filtered = SHEETS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 18px rgba(99,102,241,0.35)" }}
          >
            <BookOpen className="w-4.5 h-4.5 text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            DSA Sheets
          </h1>
        </div>
        <p style={{ color: "#8888aa" }} className="text-sm ml-12">
          Systematically master data structures and algorithms with curated problem sets
        </p>
      </motion.div>

      {/* Stats + search row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-7"
      >
        {/* Stats chips */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Sheets", value: SHEETS.length, color: "#a5b4fc" },
            { label: "Problems", value: totalProblems, color: "#fbbf24" },
            { label: "Solved", value: totalSolved, color: "#34d399" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color }}
            >
              <span className="font-bold text-sm">{value}</span>
              <span style={{ color: "#8888aa" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "#555577" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sheets or topics..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm placeholder-[#555577] text-[#e8e8f0] outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.45)";
              (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>
      </motion.div>

      {/* Overall progress bar */}
      {totalSolved > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-7 p-4 rounded-2xl"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white">Overall Progress</span>
            <span style={{ color: "#a5b4fc" }}>
              {totalSolved} / {totalProblems} problems solved ({Math.round((totalSolved / totalProblems) * 100)}%)
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(totalSolved / totalProblems) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Sheet cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
          {filtered.map((sheet, i) => (
            <SheetCard
              key={sheet.slug}
              sheet={sheet}
              solved={solvedCounts[sheet.slug] ?? 0}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-white mb-2">No sheets found</p>
          <p className="text-sm" style={{ color: "#8888aa" }}>
            Try searching with a different keyword
          </p>
        </div>
      )}
    </div>
  );
}
