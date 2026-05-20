"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Shield, Mail, User } from "lucide-react";

export default function SettingsView() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-light" /> Account Info
        </h3>
        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <p className="text-sm text-text bg-bg-elevated px-4 py-2.5 rounded-xl border border-white/[0.06]">{user?.name ?? "—"}</p>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="flex items-center gap-2 bg-bg-elevated px-4 py-2.5 rounded-xl border border-white/[0.06]">
              <Mail className="w-4 h-4 text-text-faint" />
              <p className="text-sm text-text">{user?.email ?? "—"}</p>
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <p className="text-sm text-primary-light bg-primary/10 px-4 py-2.5 rounded-xl border border-primary/20 capitalize">{user?.role ?? "admin"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-light" /> Security
        </h3>
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <Shield className="w-4 h-4 text-primary-light mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-muted leading-relaxed">
            Your session is secured with a 7-day JWT token stored in an httpOnly cookie.
            To change your password, update the <code className="text-primary-light bg-primary/10 px-1 rounded">ADMIN_PASSWORD</code> environment variable and run the seed script.
          </p>
        </div>
      </div>
    </div>
  );
}
