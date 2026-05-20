import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";
import RecentProblems from "@/components/dashboard/RecentProblems";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Overview of your DSA content</p>
      </div>
      <StatsCards />
      <Charts />
      <RecentProblems />
    </div>
  );
}
