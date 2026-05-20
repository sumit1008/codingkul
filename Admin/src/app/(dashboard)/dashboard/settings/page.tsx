import SettingsView from "@/components/dashboard/SettingsView";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage admin account and preferences</p>
      </div>
      <SettingsView />
    </div>
  );
}
