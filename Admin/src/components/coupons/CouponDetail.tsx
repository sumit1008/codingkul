"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Power, PowerOff, Pencil, Trash2, TicketPercent, IndianRupee, Users, Gift } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { daysRemaining } from "@/lib/couponStatus";
import type { AdminCoupon, AdminCouponRedemption, CouponStats, CouponStatusLabel } from "@/types";

const STATUS_STYLE: Record<CouponStatusLabel, string> = {
  ACTIVE:   "text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]",
  DISABLED: "text-[#f59e0b] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.25)]",
  EXPIRED:  "text-text-muted bg-bg-elevated border-[rgba(255,255,255,0.08)]",
  DELETED:  "text-danger bg-danger/10 border-danger/25",
};

function StatCard({ icon: Icon, label, value, color }: { icon: typeof TicketPercent; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <p className="text-xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default function CouponDetail({ couponId }: { couponId: string }) {
  const router = useRouter();
  const [coupon, setCoupon]   = useState<AdminCoupon | null>(null);
  const [stats, setStats]     = useState<CouponStats | null>(null);
  const [history, setHistory] = useState<AdminCouponRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/coupons/${couponId}`);
      const j = await r.json();
      if (!j.success) { toast.error(j.error ?? "Failed to load coupon"); return; }
      setCoupon(j.data.coupon);
      setStats(j.data.stats);
      setHistory(j.data.purchaseHistory);
    } catch { toast.error("Failed to load coupon"); }
    finally { setLoading(false); }
  }, [couponId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const toggleDisabled = async () => {
    if (!coupon) return;
    try {
      const r = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: coupon.isDisabled ? "enable" : "disable" }),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to update"); return; }
      toast.success(coupon.isDisabled ? "Coupon enabled" : "Coupon disabled");
      fetchDetail();
    } catch { toast.error("Network error"); }
  };

  const handleDelete = async () => {
    if (!coupon) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/coupons/${coupon._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Coupon deleted");
      router.push("/dashboard/coupons");
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-text-faint animate-spin" /></div>;
  }
  if (!coupon || !stats) {
    return <EmptyState title="Coupon not found" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 flex flex-wrap items-start justify-between gap-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold text-text font-mono">{coupon.code}</h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_STYLE[coupon.status]}`}>
              {coupon.status.charAt(0) + coupon.status.slice(1).toLowerCase()}
            </span>
          </div>
          {coupon.description && <p className="text-sm text-text-muted">{coupon.description}</p>}
          {coupon.expiryReason && <p className="text-xs text-text-faint mt-1">Why expired: {coupon.expiryReason}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {coupon.applicableCourses.map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-text-muted border border-white/[0.07]">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/dashboard/coupons/${coupon._id}/edit`)} className="btn-ghost flex items-center gap-2 text-sm">
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button onClick={toggleDisabled} className="btn-ghost flex items-center gap-2 text-sm">
            {coupon.isDisabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
            {coupon.isDisabled ? "Enable" : "Disable"}
          </button>
          <button onClick={() => setConfirmDelete(true)} className="p-2.5 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Coupon info grid */}
      <div className="rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-5" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div>
          <p className="text-xs text-text-faint mb-1">Discount</p>
          <p className="text-sm font-semibold text-text">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue.toLocaleString()}`}</p>
        </div>
        <div>
          <p className="text-xs text-text-faint mb-1">Created At</p>
          <p className="text-sm font-semibold text-text">{formatDate(coupon.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-text-faint mb-1">Expiry Date</p>
          <p className="text-sm font-semibold text-text">{formatDate(coupon.expiresAt)}</p>
        </div>
        <div>
          <p className="text-xs text-text-faint mb-1">Remaining Days</p>
          <p className="text-sm font-semibold text-text">{daysRemaining(coupon.expiresAt)} days</p>
        </div>
        <div>
          <p className="text-xs text-text-faint mb-1">Current Usage</p>
          <p className="text-sm font-semibold text-text font-mono">{coupon.usageCount} / {coupon.maxUsageCount}</p>
        </div>
        <div>
          <p className="text-xs text-text-faint mb-1">Created By</p>
          <p className="text-sm font-semibold text-text">{coupon.createdByName || coupon.createdByEmail || "—"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Successful Purchases" value={String(stats.totalPurchases)} color="#22d3ee" />
        <StatCard icon={IndianRupee} label="Total Revenue Generated" value={`₹${stats.totalRevenue.toLocaleString()}`} color="#22c55e" />
        <StatCard icon={Gift} label="Total Discount Given" value={`₹${stats.totalDiscountGiven.toLocaleString()}`} color="#a855f7" />
        <StatCard icon={TicketPercent} label="Remaining Uses" value={String(stats.remainingUses)} color="#eab308" />
      </div>

      {/* Purchase history */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-semibold text-text">Purchase History</h2>
        </div>
        {history.length === 0 ? (
          <EmptyState title="No redemptions yet" description="This coupon hasn't been used in a purchase yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Purchase Date", "User", "Course", "Original Price", "Discount", "Final Paid", "Payment ID", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-text">{r.userName}</p>
                      <p className="text-xs text-text-faint">{r.userEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{r.courseTier}</td>
                    <td className="px-5 py-3.5 text-sm text-text-muted">₹{r.originalPrice.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-[#22c55e]">−₹{r.discountAmount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-text">₹{r.finalAmount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs text-text-faint font-mono">{r.razorpayPaymentId}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                        r.paymentStatus === "SUCCESS"
                          ? "text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]"
                          : "text-danger bg-danger/10 border-danger/25"
                      }`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Coupon"
        description={`Delete "${coupon.code}"? It will be soft-deleted; redemption history is kept for audit.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
