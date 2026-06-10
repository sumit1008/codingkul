"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronDown, Flame, Zap,
  TrendingUp, Trophy, FileText, ExternalLink, Bookmark,
  BookmarkCheck, Target, Award, Loader2, Folder, Lock, Crown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { loadSolved, saveSolved, loadBookmarks, saveBookmarks } from "@/lib/progress";
import api from "@/lib/api";
import type { SheetDetail, TopicMeta, APIProblem } from "@/types/sheet";
import type { CourseTier } from "@/types/course";
import { TIER_LEVELS } from "@/types/course";

function isI200Sheet(slug: string, isPremium: boolean): boolean {
  return isPremium || /i.?200/i.test(slug);
}

function canAccessSheet(userTier: CourseTier, isPremium: boolean, slug: string): boolean {
  if (isI200Sheet(slug, isPremium)) return userTier === "PLACEMENT";
  return TIER_LEVELS[userTier] >= TIER_LEVELS["FOUNDATION"];
}

const DIFF: Record<string, { text: string; bg: string; border: string }> = {
  Easy: { text: "#22d3ee", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)" },
  Medium: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  Hard: { text: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
};

function DiffBadge({ d }: { d: string }) {
  const s = DIFF[d];
  if (!s) return null;
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0"
      style={{ color: s.text, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {d}
    </span>
  );
}

function RingProgress({ pct, color, size = 130 }: { pct: number; color: string; size?: number }) {
  const stroke = 9;
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <motion.circle
          cx={cx} cy={cx} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dash} ${circumference - dash}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-white">{pct}%</span>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupBySubtopic(problems: APIProblem[]): Array<[string, APIProblem[]]> {
  const map = new Map<string, APIProblem[]>();
  for (const p of problems) {
    const key = p.subtopic || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return [...map.entries()];
}

// ─── Problem row ──────────────────────────────────────────────────────────────

function ProblemRow({
  idx, problem, solved, bookmarked, onToggleSolved, onToggleBookmark,
}: {
  idx: number;
  problem: APIProblem;
  solved: boolean;
  bookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}) {
  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors border-b last:border-b-0"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
    >
      <span className="text-xs font-mono w-6 shrink-0 text-right" style={{ color: "#444466" }}>
        {idx + 1}
      </span>

      <button
        onClick={() => onToggleSolved(problem._id)}
        className="shrink-0 transition-transform hover:scale-110"
      >
        {solved ? (
          <CheckCircle2 className="w-5 h-5" style={{ color: "#22d3ee" }} />
        ) : (
          <Circle className="w-5 h-5" style={{ color: "#333355" }} />
        )}
      </button>

      <a
        href={problem.problemLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center gap-2 text-sm font-medium transition-colors group/link min-w-0"
        style={{ color: solved ? "#555577" : "#e8e8f0" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = solved ? "#555577" : "#e8e8f0"; }}
      >
        <span className={`truncate ${solved ? "line-through opacity-50" : ""}`}>
          {problem.title}
        </span>
        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover/link:opacity-40 transition-opacity" />
      </a>

      <DiffBadge d={problem.difficulty} />

      {/* Platform badge */}
      {problem.platform && (
        <span
          className="hidden lg:block text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", color: "#8888aa" }}
        >
          {problem.platform}
        </span>
      )}

      {/* Tag dots */}
      <div className="hidden lg:flex items-center gap-1 shrink-0">
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            title={tag}
            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: "rgba(255,255,255,0.07)", color: "#8888aa" }}
          >
            {tag.slice(0, 4)}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <a
          href={problem.problemLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "#555577" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#34d399"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#555577"; }}
          title="Open problem"
        >
          <FileText className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => onToggleBookmark(problem._id)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: bookmarked ? "#fbbf24" : "#555577" }}
        >
          {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ─── Topic row ────────────────────────────────────────────────────────────────

interface TopicRowProps {
  topic: TopicMeta;
  problems: APIProblem[] | null;
  loadingProblems: boolean;
  solvedIds: Set<string>;
  bookmarkedIds: Set<string>;
  accentColor: string;
  accentFrom: string;
  accentTo: string;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpen: () => void;
}

function TopicRow({
  topic, problems, loadingProblems, solvedIds, bookmarkedIds,
  accentColor, accentFrom, accentTo, onToggleSolved, onToggleBookmark, onOpen,
}: TopicRowProps) {
  const [open, setOpen] = useState(false);

  const solved = problems ? problems.filter((p) => solvedIds.has(p._id)).length : 0;
  const total = topic.totalProblems;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const xpReward = total * 50;

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !problems && !loadingProblems) onOpen();
  }

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3 transition-all duration-200"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group hover:bg-white/2 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: pct === 100 ? `${accentColor}20` : "rgba(255,255,255,0.04)",
            border: `1px solid ${pct === 100 ? accentColor + "44" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {pct === 100 ? (
            <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
          ) : (
            <Circle className="w-4 h-4" style={{ color: "#555577" }} />
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-bold text-white text-sm tracking-wide">{topic.title}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <span className="text-sm" style={{ color: "#8888aa" }}>
            {solved} / {total} problems
          </span>
          <span className="text-sm font-semibold" style={{ color: "#34d399" }}>
            +{xpReward} XP
          </span>
        </div>

        <span
          className="text-xl font-black shrink-0 w-14 text-right"
          style={{ color: pct > 0 ? "#ffffff" : "#555577" }}
        >
          {pct}%
        </span>

        {loadingProblems ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "#8888aa" }} />
        ) : (
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform duration-200"
            style={{ color: "#8888aa", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
      </button>

      <div className="mx-5 mb-4 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {loadingProblems && (
                <div className="flex items-center justify-center py-8 gap-2" style={{ color: "#8888aa" }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading problems…</span>
                </div>
              )}
              {problems && (() => {
                const groups = groupBySubtopic(problems);
                let globalIdx = 0;
                return groups.map(([subtopicName, subtopicProblems]) => (
                  <div key={subtopicName || "__ungrouped"}>
                    {subtopicName && (
                      <div
                        className="flex items-center gap-2 px-4 py-2.5 border-b"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          borderColor: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                        <span className="text-xs font-bold tracking-wide uppercase" style={{ color: "#8888aa" }}>
                          {subtopicName}
                        </span>
                        <span
                          className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: "rgba(255,255,255,0.06)", color: "#666688" }}
                        >
                          {subtopicProblems.length}
                        </span>
                      </div>
                    )}
                    {subtopicProblems.map((problem) => {
                      const idx = globalIdx++;
                      return (
                        <ProblemRow
                          key={problem._id}
                          idx={idx}
                          problem={problem}
                          solved={solvedIds.has(problem._id)}
                          bookmarked={bookmarkedIds.has(problem._id)}
                          onToggleSolved={onToggleSolved}
                          onToggleBookmark={onToggleBookmark}
                        />
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  user, totalSolved, totalXP,
}: {
  user: ReturnType<typeof import("@/lib/auth-context").useAuth>["user"];
  totalSolved: number;
  totalXP: number;
}) {
  const xp = user?.xp ?? 0;
  const xpMax = user?.xpMax ?? 5000;
  const xpPct = Math.min(Math.round((xp / xpMax) * 100), 100);
  const dailyGoal = 5;
  const dailyDone = Math.min(totalSolved % 10, dailyGoal);
  const xpGoal = 200;
  const xpDone = Math.min(xp % 500, xpGoal);

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(180,83,9,0.25), rgba(124,45,18,0.15))",
          border: "1px solid rgba(251,146,60,0.2)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white">Current Streak</span>
          <Flame className="w-4 h-4" style={{ color: "#fb923c" }} />
        </div>
        <p className="text-5xl font-black text-white mb-0.5">{user?.streak ?? 0}</p>
        <p className="text-xs" style={{ color: "#fb923c" }}>days in a row</p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-bold text-white mb-4">Daily Goals</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span style={{ color: "#8888aa" }}>Problems Today</span>
            <span className="font-semibold text-white">{dailyDone} / {dailyGoal}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(dailyDone / dailyGoal) * 100}%`,
                background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span style={{ color: "#8888aa" }}>XP Goal</span>
            <span className="font-semibold text-white">{xpDone} / {xpGoal}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(xpDone / xpGoal) * 100}%`,
                background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-bold text-white mb-4">Level Progress</h3>
        <p className="text-xs mb-1" style={{ color: "#8888aa" }}>Level {user?.level ?? 1}</p>
        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-black text-white">{user?.title ?? "Apprentice"}</p>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #06b6d4, #22d3ee)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: "#8888aa" }}>Progress to Level {(user?.level ?? 1) + 1}</span>
          <span className="font-semibold" style={{ color: "#22d3ee" }}>
            {xp.toLocaleString()} / {xpMax.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #06b6d4, #22d3ee)" }}
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Global Rank</h3>
          <TrendingUp className="w-4 h-4" style={{ color: "#34d399" }} />
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f122, #a855f711)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <Trophy className="w-5 h-5" style={{ color: "#fbbf24" }} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">#{(user?.rank ?? 0).toLocaleString()}</p>
            <p className="text-xs" style={{ color: "#34d399" }}>
              Top {Math.max(1, 100 - Math.round((user?.rank ?? 9999) / 100))}%
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h3 className="text-sm font-bold text-white mb-3">Sheet Stats</h3>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, label: "Solved", value: totalSolved, color: "#22d3ee" },
            { icon: Zap, label: "XP from Sheet", value: `+${totalXP.toLocaleString()}`, color: "#fbbf24" },
            { icon: Award, label: "Bookmarked", value: 0, color: "#a855f7" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                <span className="text-xs" style={{ color: "#8888aa" }}>{label}</span>
              </div>
              <span className="text-sm font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SheetPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const [sheet, setSheet] = useState<SheetDetail | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Per-topic: null = not fetched, APIProblem[] = loaded
  const [topicProblems, setTopicProblems] = useState<Record<string, APIProblem[]>>({});
  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Fetch sheet detail
  useEffect(() => {
    if (!slug) return;
    setPageLoading(true);
    api
      .get<{ success: boolean; data: SheetDetail }>(`/sheets/${slug}`)
      .then((res) => setSheet(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setPageLoading(false));
  }, [slug]);

  // Load localStorage progress
  useEffect(() => {
    if (!user?.id || !slug) return;
    setSolved(loadSolved(user.id, slug));
    setBookmarked(loadBookmarks(user.id, slug));
    setMounted(true);
  }, [user?.id, slug]);

  useEffect(() => {
    if (!mounted || !user?.id) return;
    saveSolved(user.id, slug, solved);
  }, [solved, mounted, user?.id, slug]);

  useEffect(() => {
    if (!mounted || !user?.id) return;
    saveBookmarks(user.id, slug, bookmarked);
  }, [bookmarked, mounted, user?.id, slug]);

  const fetchTopicProblems = useCallback(
    async (topicSlug: string) => {
      if (topicProblems[topicSlug] !== undefined) return;
      setLoadingTopics((prev) => new Set(prev).add(topicSlug));
      try {
        const res = await api.get<{ success: boolean; data: APIProblem[] }>(
          `/sheets/${slug}/topics/${topicSlug}/problems`
        );
        setTopicProblems((prev) => ({ ...prev, [topicSlug]: res.data.data }));
      } catch {
        setTopicProblems((prev) => ({ ...prev, [topicSlug]: [] }));
      } finally {
        setLoadingTopics((prev) => {
          const next = new Set(prev);
          next.delete(topicSlug);
          return next;
        });
      }
    },
    [slug, topicProblems]
  );

  const toggleSolved = useCallback((id: string) => {
    setSolved((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  // Compute totals from loaded problems only
  const allLoadedProblems = Object.values(topicProblems).flat();
  const solvedCount = allLoadedProblems.filter((p) => solved.has(p._id)).length;
  const totalLoaded = allLoadedProblems.length;
  const total = sheet?.totalProblems ?? 0;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
  const totalXPEarned = solvedCount * 50;

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#8888aa" }} />
      </div>
    );
  }

  if (notFound || !sheet) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-center">
        <p className="text-xl font-bold text-white mb-2">Sheet not found</p>
        <p className="text-sm mb-6" style={{ color: "#8888aa" }}>
          This sheet doesn&apos;t exist.
        </p>
        <Link href="/sheets">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sheets
          </button>
        </Link>
      </div>
    );
  }

  // ── Access gate ──────────────────────────────────────────────────────────────
  const userTier: CourseTier = user?.courseTier ?? "NONE";
  const hasAccess = canAccessSheet(userTier, sheet.isPremium, slug);

  if (!hasAccess) {
    const needsPlacement = isI200Sheet(slug, sheet.isPremium);
    return (
      <div className="p-5 sm:p-7">
        {/* Back */}
        <Link
          href="/sheets"
          className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
          style={{ color: "#8888aa" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
        >
          <ArrowLeft className="w-4 h-4" /> DSA Sheets
        </Link>

        {/* Blurred header */}
        <div className="relative max-w-3xl" style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
          <h1
            className="text-3xl sm:text-4xl font-black mb-1.5 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${sheet.accentFrom}, ${sheet.accentTo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {sheet.title}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8888aa" }}>{sheet.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {["Problems Solved", "Total XP", "Streak", "Rank"].map((l) => (
              <div key={l} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs mb-2" style={{ color: "#8888aa" }}>{l}</p>
                <p className="text-xl font-black text-white">—</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lock card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mt-2 rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(160deg, rgba(14,14,30,0.95), rgba(10,10,22,0.98))",
            border: needsPlacement
              ? "1px solid rgba(168,85,247,0.3)"
              : "1px solid rgba(99,102,241,0.25)",
            boxShadow: needsPlacement
              ? "0 0 40px rgba(168,85,247,0.08)"
              : "0 0 40px rgba(99,102,241,0.08)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: needsPlacement ? "rgba(168,85,247,0.1)" : "rgba(99,102,241,0.1)",
              border: needsPlacement ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Lock className="w-7 h-7" style={{ color: needsPlacement ? "#c084fc" : "#a5b4fc" }} />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {needsPlacement ? "Placement Plan Required" : "Paid Plan Required"}
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#8888aa" }}>
            {needsPlacement
              ? "The I-200 sheet is exclusively available to Placement Mastery students. Upgrade to unlock 200 curated interview problems."
              : "This sheet is available for all paid plan members. Upgrade to start solving problems and track your progress."}
          </p>

          <div className="space-y-3">
            <Link href={needsPlacement ? "/courses/placement" : "/courses"}>
              <button
                className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: needsPlacement
                    ? "linear-gradient(135deg, #7c3aed, #9333ea)"
                    : "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: needsPlacement
                    ? "0 0 20px rgba(168,85,247,0.25)"
                    : "0 0 20px rgba(99,102,241,0.25)",
                }}
              >
                <Crown className="w-4 h-4" />
                {needsPlacement ? "Upgrade to Placement" : "View Plans"}
              </button>
            </Link>
            <Link href="/sheets">
              <button
                className="w-full h-10 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#8888aa" }}
              >
                Back to Sheets
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-7">
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/sheets"
          className="inline-flex items-center gap-1.5 text-sm mb-6 group transition-colors"
          style={{ color: "#8888aa" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          DSA Sheets
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1
              className="text-3xl sm:text-4xl font-black mb-1.5 tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${sheet.accentFrom}, ${sheet.accentTo})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {sheet.title}
            </h1>
            <p className="text-sm mb-6" style={{ color: "#8888aa" }}>
              {sheet.description}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
          >
            {[
              { icon: CheckCircle2, label: "Problems Solved", value: solvedCount, color: "#22d3ee" },
              { icon: Zap, label: "Total XP", value: user?.xp?.toLocaleString() ?? "0", color: "#fbbf24" },
              { icon: Flame, label: "Current Streak", value: `${user?.streak ?? 0} days`, color: "#fb923c" },
              { icon: Trophy, label: "Global Rank", value: `#${user?.rank ?? 0}`, color: "#a5b4fc" },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs" style={{ color: "#8888aa" }}>{label}</p>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-xl font-black text-white">{value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex-1">
              <h2 className="text-lg font-black text-white uppercase tracking-wide mb-1">
                {sheet.title}
              </h2>
              <p className="text-sm mb-4" style={{ color: "#8888aa" }}>
                {sheet.description}
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "#8888aa" }}>Progress</p>
                  <p className="text-xl font-black text-white">{solvedCount} / {total}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "#8888aa" }}>XP Earned</p>
                  <p className="text-xl font-black" style={{ color: "#22d3ee" }}>
                    +{totalXPEarned.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "#8888aa" }}>Completion</p>
                  <p className="text-xl font-black text-white">{pct}%</p>
                </div>
              </div>
              <button
                className="mt-4 flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${sheet.accentFrom}, ${sheet.accentTo})`,
                  boxShadow: `0 4px 16px ${sheet.accentColor}33`,
                }}
              >
                <Target className="w-4 h-4" />
                Continue Learning
              </button>
            </div>
            <RingProgress pct={pct} color={sheet.accentColor} />
          </motion.div>

          {/* Topic list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {sheet.topics.map((topic) => (
              <TopicRow
                key={topic._id}
                topic={topic}
                problems={topicProblems[topic.slug] ?? null}
                loadingProblems={loadingTopics.has(topic.slug)}
                solvedIds={solved}
                bookmarkedIds={bookmarked}
                accentColor={sheet.accentColor}
                accentFrom={sheet.accentFrom}
                accentTo={sheet.accentTo}
                onToggleSolved={toggleSolved}
                onToggleBookmark={toggleBookmark}
                onOpen={() => fetchTopicProblems(topic.slug)}
              />
            ))}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Sidebar user={user} totalSolved={solvedCount} totalXP={totalXPEarned} />
        </div>
      </div>
    </div>
  );
}
