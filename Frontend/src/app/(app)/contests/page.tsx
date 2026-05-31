"use client";

import { motion } from "framer-motion";
import { Trophy, History, BarChart2, Users } from "lucide-react";
import HeroSection from "@/components/contest/HeroSection";
import ContestCard from "@/components/contest/ContestCard";
import ContestList from "@/components/contest/ContestList";
import AnalyticsCharts from "@/components/contest/AnalyticsCharts";
import Leaderboard from "@/components/contest/Leaderboard";
import {
  useUpcomingContests,
  usePreviousContests,
} from "@/hooks/useContests";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <Icon style={{ color: "#a5b4fc", width: "18px", height: "18px" }} />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-sm ml-12" style={{ color: "#7878a0" }}>
        {subtitle}
      </p>
    </motion.div>
  );
}

function Divider({ color = "rgba(99,102,241,0.3)" }: { color?: string }) {
  return (
    <div
      className="my-0 mb-16 rounded-full h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    />
  );
}

function ContestCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", height: "320px" }}
    />
  );
}

export default function ContestsPage() {
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingContests();
  const { data: previous, isLoading: previousLoading } = usePreviousContests();

  const displayUpcoming = upcoming ?? [];
  const displayPrevious = previous ?? [];

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      {/* Page glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10">
        {/* Hero */}
        <HeroSection />

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div
            className="my-6 rounded-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
          />

          {/* Section 2 — Upcoming Contests */}
          <section className="mb-16">
            <SectionHeader
              icon={Trophy}
              title="Upcoming Contests"
              subtitle="Register now and compete on Codeforces"
            />
            {upcomingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContestCardSkeleton />
                <ContestCardSkeleton />
              </div>
            ) : displayUpcoming.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: "#333355" }} />
                <p className="text-sm font-medium" style={{ color: "#555577" }}>No upcoming contests scheduled</p>
                <p className="text-xs mt-1" style={{ color: "#444466" }}>Check back soon for the next contest announcement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayUpcoming.map((c, i) => (
                  <ContestCard key={c.id} contest={c} index={i} />
                ))}
              </div>
            )}
          </section>

          <Divider color="rgba(168,85,247,0.25)" />

          {/* Section 3 — Previous Contests */}
          <section className="mb-16">
            <SectionHeader
              icon={History}
              title="Previous Contests"
              subtitle="View your past performance and track improvement"
            />
            {previousLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl h-16 animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  />
                ))}
              </div>
            ) : (
              <ContestList contests={displayPrevious} />
            )}
          </section>

          <Divider color="rgba(34,211,238,0.2)" />

          {/* Section 4 — Analytics */}
          <section className="mb-16">
            <SectionHeader
              icon={BarChart2}
              title="Your Analytics"
              subtitle="Track your rating progress and XP growth over time"
            />
            <AnalyticsCharts />
          </section>

          <Divider color="rgba(99,102,241,0.3)" />

          {/* Section 5 — Leaderboard */}
          <section>
            <SectionHeader
              icon={Users}
              title="Contest Leaderboard"
              subtitle="Top performers in the academy"
            />
            <Leaderboard />
          </section>
        </div>
      </div>
    </div>
  );
}
