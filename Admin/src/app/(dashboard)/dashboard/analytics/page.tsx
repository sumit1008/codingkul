import AnalyticsView from "@/components/dashboard/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Detailed breakdown of your content</p>
      </div>
      <AnalyticsView />
    </div>
  );
}
