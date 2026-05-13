"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, BookOpen, CheckCircle2, Circle,
  Bookmark, BookmarkCheck, Play, FileText, ExternalLink,
  ChevronDown, SlidersHorizontal, Trophy, Zap, Target,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SHEETS, loadSolved, saveSolved, loadBookmarks, saveBookmarks, type Problem } from "@/data/sheets";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFF_STYLE = {
  Easy: { text: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  Medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  Hard: { text: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)" },
};

const COMPANY_COLORS: Record<string, string> = {
  Amazon: "#ff9900",
  Google: "#4285f4",
  Meta: "#0866ff",
  Microsoft: "#00a4ef",
  Apple: "#a2aaad",
  Bloomberg: "#5e5ce6",
  Adobe: "#ff0000",
  Flipkart: "#2874f0",
  Uber: "#000000",
  Netflix: "#e50914",
};

function DiffBadge({ diff }: { diff: Problem["difficulty"] }) {
  const s = DIFF_STYLE[diff];
  return (
    <span
      className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap"
      style={{ color: s.text, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {diff}
    </span>
  );
}

function CompanyDot({ name }: { name: string }) {
  const color = COMPANY_COLORS[name] ?? "#8888aa";
  return (
    <span
      title={name}
      className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 cursor-default"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {name[0]}
    </span>
  );
}

// ─── Problem row ───────────────────────────────────────────────────────────────

interface RowProps {
  index: number;
  problem: Problem;
  solved: boolean;
  bookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

function ProblemRow({ index, problem, solved, bookmarked, onToggleSolved, onToggleBookmark }: RowProps) {
  const leetcodeBase = `https://leetcode.com/problems/${problem.slug}/`;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.4) }}
      className="group border-b"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
    >
      {/* # */}
      <td className="py-3.5 pl-4 pr-2 w-10">
        <span className="text-xs font-mono" style={{ color: "#555577" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Status toggle */}
      <td className="py-3.5 px-2 w-10">
        <button
          onClick={() => onToggleSolved(problem.id)}
          className="transition-transform hover:scale-110"
          title={solved ? "Mark unsolved" : "Mark solved"}
        >
          {solved ? (
            <CheckCircle2 className="w-5 h-5" style={{ color: "#34d399" }} />
          ) : (
            <Circle className="w-5 h-5 transition-colors" style={{ color: "#444466" }} />
          )}
        </button>
      </td>

      {/* Title */}
      <td className="py-3.5 px-2">
        <a
          href={leetcodeBase}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium transition-colors group/link"
          style={{ color: solved ? "#6677aa" : "#e8e8f0" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = solved ? "#6677aa" : "#e8e8f0"; }}
        >
          {solved && <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />}
          <span className={solved ? "line-through opacity-60" : ""}>{problem.title}</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-50 transition-opacity shrink-0" />
        </a>
      </td>

      {/* Difficulty */}
      <td className="py-3.5 px-2 hidden sm:table-cell">
        <DiffBadge diff={problem.difficulty} />
      </td>

      {/* Topic */}
      <td className="py-3.5 px-2 hidden md:table-cell">
        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ color: "#8888aa", background: "rgba(255,255,255,0.04)" }}>
          {problem.topic}
        </span>
      </td>

      {/* Companies */}
      <td className="py-3.5 px-2 hidden lg:table-cell">
        <div className="flex items-center gap-1">
          {problem.companies.slice(0, 4).map((c) => (
            <CompanyDot key={c} name={c} />
          ))}
          {problem.companies.length > 4 && (
            <span className="text-[10px]" style={{ color: "#555577" }}>
              +{problem.companies.length - 4}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-2 pr-4 w-28">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {problem.hasVideo && (
            <a
              href={leetcodeBase}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-colors hover:bg-white/8"
              title="Watch video"
              style={{ color: "#8888aa" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
            >
              <Play className="w-3.5 h-3.5" />
            </a>
          )}
          {problem.hasArticle && (
            <a
              href={leetcodeBase}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-colors"
              title="Read article"
              style={{ color: "#8888aa" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#34d399"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
            >
              <FileText className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => onToggleBookmark(problem.id)}
            className="p-1.5 rounded-lg transition-colors"
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
            style={{ color: bookmarked ? "#fbbf24" : "#8888aa" }}
            onMouseEnter={(e) => { if (!bookmarked) (e.currentTarget as HTMLButtonElement).style.color = "#fbbf24"; }}
            onMouseLeave={(e) => { if (!bookmarked) (e.currentTarget as HTMLButtonElement).style.color = "#8888aa"; }}
          >
            {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type DiffFilter = "All" | "Easy" | "Medium" | "Hard";
type StatusFilter = "All" | "Solved" | "Unsolved" | "Bookmarked";

export default function SheetPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const sheet = SHEETS.find((s) => s.slug === slug);

  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [topicOpen, setTopicOpen] = useState(false);

  // Load persisted progress on mount
  useEffect(() => {
    if (!user?.id || !slug) return;
    setSolved(loadSolved(user.id, slug));
    setBookmarked(loadBookmarks(user.id, slug));
    setMounted(true);
  }, [user?.id, slug]);

  // Auto-save solved
  useEffect(() => {
    if (!mounted || !user?.id) return;
    saveSolved(user.id, slug, solved);
  }, [solved, mounted, user?.id, slug]);

  // Auto-save bookmarks
  useEffect(() => {
    if (!mounted || !user?.id) return;
    saveBookmarks(user.id, slug, bookmarked);
  }, [bookmarked, mounted, user?.id, slug]);

  const toggleSolved = useCallback((id: string) => {
    setSolved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (!sheet) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <p className="text-xl font-semibold text-white mb-2">Sheet not found</p>
        <p className="text-sm mb-6" style={{ color: "#8888aa" }}>
          The sheet you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/sheets">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sheets
          </button>
        </Link>
      </div>
    );
  }

  const topics = ["All", ...Array.from(new Set(sheet.problems.map((p) => p.topic))).sort()];
  const total = sheet.problems.length;
  const solvedCount = sheet.problems.filter((p) => solved.has(p.id)).length;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
  const easyCount = sheet.problems.filter((p) => p.difficulty === "Easy").length;
  const medCount = sheet.problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = sheet.problems.filter((p) => p.difficulty === "Hard").length;

  // Apply filters
  const filtered = sheet.problems.filter((p) => {
    if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
    if (topicFilter !== "All" && p.topic !== topicFilter) return false;
    if (statusFilter === "Solved" && !solved.has(p.id)) return false;
    if (statusFilter === "Unsolved" && solved.has(p.id)) return false;
    if (statusFilter === "Bookmarked" && !bookmarked.has(p.id)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/sheets"
          className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors group"
          style={{ color: "#8888aa" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          DSA Sheets
        </Link>
      </motion.div>

      {/* Sheet header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-5 sm:p-6 mb-6"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Top accent */}
        <div
          className="h-0.5 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 sm:mb-6 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${sheet.colorFrom}, ${sheet.colorTo})` }}
        />

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{
              background: `linear-gradient(135deg, ${sheet.colorFrom}22, ${sheet.colorTo}11)`,
              border: `1px solid ${sheet.colorFrom}33`,
              boxShadow: `0 0 24px ${sheet.colorFrom}18`,
            }}
          >
            {sheet.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
              {sheet.title}
            </h1>
            <p className="text-sm mb-3" style={{ color: "#6677aa" }}>
              by {sheet.author}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#8888aa" }}>
              {sheet.description}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { icon: BookOpen, label: "Total Problems", value: total, color: "#a5b4fc" },
            { icon: CheckCircle2, label: "Solved", value: solvedCount, color: "#34d399" },
            { icon: Target, label: "Progress", value: `${pct}%`, color: sheet.accentColor },
            { icon: Trophy, label: "Bookmarked", value: bookmarked.size, color: "#fbbf24" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
              <p className="text-base font-bold text-white">{value}</p>
              <p className="text-[11px]" style={{ color: "#6677aa" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-3">
              <span style={{ color: "#34d399" }}>● {easyCount} Easy</span>
              <span style={{ color: "#fbbf24" }}>● {medCount} Medium</span>
              <span style={{ color: "#fb7185" }}>● {hardCount} Hard</span>
            </div>
            <span style={{ color: sheet.accentColor }} className="font-semibold">
              {pct}% complete
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${sheet.colorFrom}, ${sheet.colorTo})` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-5"
      >
        {/* Difficulty tabs */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["All", "Easy", "Medium", "Hard"] as DiffFilter[]).map((d) => {
            const active = diffFilter === d;
            const col = d === "All" ? "#a5b4fc" : DIFF_STYLE[d].text;
            return (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className="px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  color: active ? (d === "All" ? "#fff" : col) : "#8888aa",
                  background: active ? (d === "All" ? "rgba(99,102,241,0.2)" : `${col}18`) : "transparent",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Status filter */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["All", "Solved", "Unsolved", "Bookmarked"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                color: statusFilter === s ? "#fff" : "#8888aa",
                background: statusFilter === s ? "rgba(99,102,241,0.2)" : "transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Topic dropdown */}
        <div className="relative">
          <button
            onClick={() => setTopicOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: topicFilter !== "All" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${topicFilter !== "All" ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
              color: topicFilter !== "All" ? "#a5b4fc" : "#8888aa",
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {topicFilter === "All" ? "Topic" : topicFilter}
            <ChevronDown
              className="w-3 h-3 transition-transform"
              style={{ transform: topicOpen ? "rotate(180deg)" : "none" }}
            />
          </button>

          <AnimatePresence>
            {topicOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden z-20"
                style={{
                  background: "#0d0d20",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <div className="py-1 max-h-56 overflow-y-auto">
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTopicFilter(t); setTopicOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs transition-colors"
                      style={{
                        color: topicFilter === t ? "#a5b4fc" : "#8888aa",
                        background: topicFilter === t ? "rgba(99,102,241,0.12)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (topicFilter !== t)
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (topicFilter !== t)
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "#555577" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="pl-9 pr-4 py-1.5 rounded-xl text-xs placeholder-[#555577] text-[#e8e8f0] outline-none transition-all w-48"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.45)";
              (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(99,102,241,0.07)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>

        {/* Results count */}
        <span className="text-xs ml-1" style={{ color: "#555577" }}>
          {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Problem table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="py-3 pl-4 pr-2 text-left w-10">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>#</span>
              </th>
              <th className="py-3 px-2 w-10">
                <Zap className="w-3.5 h-3.5 mx-auto" style={{ color: "#555577" }} />
              </th>
              <th className="py-3 px-2 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>Problem</span>
              </th>
              <th className="py-3 px-2 text-left hidden sm:table-cell">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>Difficulty</span>
              </th>
              <th className="py-3 px-2 text-left hidden md:table-cell">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>Topic</span>
              </th>
              <th className="py-3 px-2 text-left hidden lg:table-cell">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>Companies</span>
              </th>
              <th className="py-3 pl-2 pr-4 w-28">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#555577" }}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody style={{ background: "rgba(5,5,16,0.6)" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((problem, i) => (
                <ProblemRow
                  key={problem.id}
                  index={i}
                  problem={problem}
                  solved={solved.has(problem.id)}
                  bookmarked={bookmarked.has(problem.id)}
                  onToggleSolved={toggleSolved}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-white mb-1">No problems match</p>
            <p className="text-xs" style={{ color: "#8888aa" }}>
              Try changing the filters or search query
            </p>
          </div>
        )}
      </motion.div>

      {/* Footer summary */}
      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: "#555577" }}>
            Showing {filtered.length} of {total} problems
          </p>
          <p className="text-xs" style={{ color: "#555577" }}>
            Click the circle to mark solved · Click the bookmark to save for later
          </p>
        </div>
      )}
    </div>
  );
}
