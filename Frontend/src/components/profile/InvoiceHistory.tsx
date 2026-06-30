"use client";

import { Download } from "lucide-react";
import { profileApi } from "@/lib/api";
import type { Purchase } from "@/types/profile";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function InvoiceHistory({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm" style={{ color: "#8888aa" }}>No invoices yet — they&apos;ll appear here after your first purchase.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#8888aa" }}>Invoice History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Invoice No.", "Course", "Date", "Discount", "Final Amount", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8888aa" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "#aaaacc" }}>{p.invoiceNumber}</td>
                <td className="px-5 py-3.5 text-sm text-white">{p.courseTitle}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#8888aa" }}>{formatDate(p.createdAt)}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: p.discountAmount > 0 ? "#22c55e" : "#8888aa" }}>
                  {p.discountAmount > 0 ? `−₹${p.discountAmount.toLocaleString()}` : "—"}
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-white">₹{p.finalAmount.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <a
                    href={profileApi.invoiceDownloadUrl(p._id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
