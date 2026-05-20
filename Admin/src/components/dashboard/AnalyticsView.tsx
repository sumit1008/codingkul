"use client";

import Charts from "./Charts";
import StatsCards from "./StatsCards";
import RecentProblems from "./RecentProblems";

export default function AnalyticsView() {
  return (
    <div className="space-y-8">
      <StatsCards />
      <Charts />
      <RecentProblems />
    </div>
  );
}
