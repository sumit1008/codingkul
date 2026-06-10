"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2, TrendingUp, Star, Zap, Flame, BookOpen, Lock, ArrowRight, Crown,
} from "lucide-react";
import { useAuth, getHighestPurchasedRank, PRODUCT_TIER_RANK } from "@/lib/auth-context";
import { loadSolved } from "@/lib/progress";
import api from "@/lib/api";
import type { SheetMeta } from "@/types/sheet";

// ── Access logic (product-purchase based) ───────────────────────────────────

function isI200Sheet(slug: string, isPremium: boolean): boolean {
  return isPremium || /i.?200/i.test(slug);
}

function canAccessSheet(userRank: number, isPremium: boolean, slug: string): boolean {
  if (isI200Sheet(slug, isPremium)) return userRank >= PRODUCT_TIER_RANK["placement"]; // rank 3
  return userRank >= 1; // any paid plan
}

function requiredTierLabel(isPremium: boolean, slug: string): string {
  return isI200Sheet(slug, isPremium) ? "Placement Plan required" : "Any paid plan required";
}

// ── Feature lists ────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  { icon: CheckCircle2, text: "Topic-wise progression system" },
  { icon: CheckCircle2, text: "100+ curated problems" },
  { icon: CheckCircle2, text: "Unlockable topics & achievements" },
];

const PREMIUM_FEATURES = [
  { icon: TrendingUp, text: "High-frequency interview questions" },
  { icon: TrendingUp, text: "Company-wise problem tags" },
  { icon: TrendingUp, text: "Interview readiness tracking" },
];

// ── Solved hook ──────────────────────────────────────────────────────────────

function useSolvedCounts(userId: string, sheets: SheetMeta[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!sheets.length || !userId) return;
    const result: Record<string, number> = {};
    for (const s of sheets) result[s.slug] = loadSolved(userId, s.slug).size;
    setCounts(result);
  }, [userId, sheets]);
  return counts;
}

// ── Sheet Card ───────────────────────────────────────────────────────────────

function SheetCard({
  sheet, solved, hasAccess, onLockedClick,
}: {
  sheet: SheetMeta;
  solved: number;
  hasAccess: boolean;
  onLockedClick: () => void;
}) {
  const router = useRouter();
  const total = sheet.totalProblems;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const features = sheet.isPremium ? PREMIUM_FEATURES : FREE_FEATURES;

  const handleClick = () => {
    if (hasAccess) router.push(`/sheet/${sheet.slug}`);
    else onLockedClick();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.012, y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="relative rounded-2xl h-full flex flex-col overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hasAccess
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        opacity: hasAccess ? 1 : 0.75,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = hasAccess
          ? `${sheet.accentColor}44`
          : "rgba(99,102,241,0.3)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = hasAccess
          ? `0 8px 40px ${sheet.accentColor}18`
          : "0 8px 40px rgba(99,102,241,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = hasAccess
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.05)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
      }}
    >
      {/* Lock overlay */}
      {!hasAccess && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl"
          style={{ background: "rgba(5,5,16,0.7)", backdropFilter: "blur(3px)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <Lock className="w-6 h-6" style={{ color: "#a5b4fc" }} />
          </div>
          <div className="text-center px-6">
            <p className="text-sm font-bold text-white mb-1">
              {sheet.isPremium ? "Placement Exclusive" : "Paid Members Only"}
            </p>
            <p className="text-xs mb-4" style={{ color: "#8888aa" }}>
              {requiredTierLabel(sheet.isPremium, sheet.slug)}
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 16px rgba(99,102,241,0.3)",
              }}
            >
              <Crown className="w-3.5 h-3.5" />
              {sheet.isPremium ? "Upgrade to Placement" : "View Plans"}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Premium badge */}
      {sheet.isPremium && (
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold z-5"
          style={{ background: `linear-gradient(135deg, ${sheet.accentFrom}, ${sheet.accentTo})` }}
        >
          <Star className="w-3 h-3 fill-white text-white" />
          PREMIUM
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col" style={{ filter: hasAccess ? "none" : "blur(1.5px)" }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: `linear-gradient(135deg, ${sheet.accentFrom}22, ${sheet.accentTo}11)`,
            border: `1px solid ${sheet.accentFrom}33`,
          }}
        >
          {sheet.isPremium ? (
            <Star className="w-6 h-6" style={{ color: sheet.accentColor }} />
          ) : (
            <BookOpen className="w-6 h-6" style={{ color: sheet.accentColor }} />
          )}
        </div>

        <h2
          className="text-2xl font-black mb-2 tracking-tight"
          style={sheet.isPremium ? { color: sheet.accentColor } : { color: "#ffffff" }}
        >
          {sheet.title.toUpperCase()}
        </h2>

        <p className="text-sm leading-relaxed mb-5" style={{ color: "#8888aa" }}>
          {sheet.description}
        </p>

        <div className="space-y-2.5 mb-5 flex-1">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: sheet.isPremium ? "#a855f7" : "#22d3ee" }}
              />
              <span className="text-sm" style={{ color: "#ccccdd" }}>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-5">
          <Zap className="w-3.5 h-3.5" style={{ color: sheet.accentColor }} />
          <span className="text-sm font-medium" style={{ color: sheet.accentColor }}>
            {sheet.isPremium ? "Perfect for interview prep" : "Perfect for beginners to advanced"}
          </span>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs mb-0.5" style={{ color: "#8888aa" }}>Progress</p>
              <p className="text-xl font-bold text-white">
                {hasAccess ? solved : "—"} / {total}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-0.5" style={{ color: "#8888aa" }}>Solved</p>
              <p className="text-xl font-bold" style={{ color: sheet.accentColor }}>
                {hasAccess ? `${pct}%` : "—"}
              </p>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            {hasAccess && (
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${sheet.accentFrom}, ${sheet.accentTo})` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6" style={{ filter: hasAccess ? "none" : "blur(1.5px)" }}>
        <div
          className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all duration-200"
          style={{
            background: hasAccess
              ? `linear-gradient(135deg, ${sheet.accentFrom}, ${sheet.accentTo})`
              : "rgba(255,255,255,0.05)",
            boxShadow: hasAccess ? `0 4px 16px ${sheet.accentColor}33` : "none",
          }}
        >
          {hasAccess ? "Open Dashboard →" : "Locked"}
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SheetsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sheets, setSheets] = useState<SheetMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const userRank = getHighestPurchasedRank(user);

  useEffect(() => {
    api
      .get<{ success: boolean; data: SheetMeta[] }>("/sheets")
      .then((res) => setSheets(res.data.data))
      .catch(() => setSheets([]))
      .finally(() => setLoading(false));
  }, []);

  const solvedCounts = useSolvedCounts(user?.id ?? "", sheets);

  const totalProblems = sheets.reduce((acc, s) => acc + s.totalProblems, 0);
  const totalSolved = Object.values(solvedCounts).reduce((acc, n) => acc + n, 0);

  const globalStats = [
    { value: totalProblems > 0 ? `${totalProblems}+` : "—", label: "Total Problems", color: "#a5b4fc" },
    { value: totalSolved.toString(), label: "Problems Solved", color: "#34d399" },
    { value: user?.xp.toLocaleString() ?? "0", label: "Total XP Earned", color: "#22d3ee" },
    { value: `${user?.streak ?? 0}`, label: "Day Streak", color: "#fb923c" },
  ];

  return (
    <div className="min-h-full p-6 sm:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center mb-10"
      >
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{
            background: "linear-gradient(135deg, #a5b4fc, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DSA Sheets
        </h1>
        <p className="text-base" style={{ color: "#8888aa" }}>
          Choose your learning path and start solving
        </p>

        {/* Tier banner — shown when no product purchased */}
        {userRank === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#a5b4fc",
            }}
          >
            <Lock className="w-3.5 h-3.5" />
            Sheets are locked on the free plan.
            <button
              onClick={() => router.push("/courses")}
              className="font-semibold underline underline-offset-2 hover:text-white transition-colors"
            >
              Upgrade to unlock
            </button>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[0, 1].map((i) => (
            <div key={i} className="h-96 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {sheets.map((sheet, i) => {
            const hasAccess = canAccessSheet(userRank, sheet.isPremium, sheet.slug);
            return (
              <motion.div
                key={sheet.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <SheetCard
                  sheet={sheet}
                  solved={solvedCounts[sheet.slug] ?? 0}
                  hasAccess={hasAccess}
                  onLockedClick={() => router.push("/courses")}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {globalStats.map(({ value, label, color }) => (
          <div
            key={label}
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
            <p className="text-xs" style={{ color: "#8888aa" }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {(user?.streak ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-2 text-sm"
          style={{ color: "#fb923c" }}
        >
          <Flame className="w-4 h-4" />
          <span className="font-semibold">{user?.streak} day streak</span>
          <span style={{ color: "#555577" }}>— keep it going!</span>
        </motion.div>
      )}
    </div>
  );
}
