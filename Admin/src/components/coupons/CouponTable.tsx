"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable, getCoreRowModel, flexRender, type ColumnDef,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Power, PowerOff, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { daysRemaining } from "@/lib/couponStatus";
import { COURSE_TIERS, type AdminCoupon, type CouponStatusLabel } from "@/types";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "",         label: "All" },
  { value: "active",   label: "Active" },
  { value: "expired",  label: "Expired" },
  { value: "disabled", label: "Disabled" },
];

const STATUS_STYLE: Record<CouponStatusLabel, string> = {
  ACTIVE:   "text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]",
  DISABLED: "text-[#f59e0b] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.25)]",
  EXPIRED:  "text-text-muted bg-bg-elevated border-[rgba(255,255,255,0.08)]",
  DELETED:  "text-danger bg-danger/10 border-danger/25",
};

interface Props {
  forceStatus?: "expired";
}

export default function CouponTable({ forceStatus }: Props) {
  const router = useRouter();
  const [coupons, setCoupons]   = useState<AdminCoupon[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState(forceStatus ?? "");
  const [course, setCourse]     = useState("");
  const [deleteTarget, setDel]  = useState<AdminCoupon | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search) params.set("q", search);
      if (status) params.set("status", status);
      if (course) params.set("course", course);
      const r = await fetch(`/api/coupons?${params.toString()}`);
      const j = await r.json();
      setCoupons(j.data?.coupons ?? []);
    } catch { toast.error("Failed to load coupons"); }
    finally { setLoading(false); }
  }, [search, status, course]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons, refreshKey]);

  const toggleDisabled = async (c: AdminCoupon) => {
    try {
      const r = await fetch(`/api/coupons/${c._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: c.isDisabled ? "enable" : "disable" }),
      });
      const j = await r.json();
      if (!r.ok || !j.success) { toast.error(j.error ?? "Failed to update"); return; }
      toast.success(c.isDisabled ? "Coupon enabled" : "Coupon disabled");
      setRefreshKey((k) => k + 1);
    } catch { toast.error("Network error"); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/coupons/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Coupon deleted");
      setDel(null);
      setRefreshKey((k) => k + 1);
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  const columns: ColumnDef<AdminCoupon>[] = [
    {
      accessorKey: "code",
      header: "Coupon Code",
      cell: ({ row: { original: c } }) => (
        <Link href={`/dashboard/coupons/${c._id}`} className="text-sm font-semibold text-text font-mono hover:text-primary-light transition-colors">
          {c.code}
        </Link>
      ),
    },
    {
      id: "discount",
      header: "Discount",
      cell: ({ row: { original: c } }) => (
        <span className="text-sm text-text-muted">
          {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₹${c.discountValue.toLocaleString()}`}
        </span>
      ),
    },
    {
      id: "courses",
      header: "Applicable Courses",
      cell: ({ row: { original: c } }) => (
        <div className="flex flex-wrap gap-1">
          {c.applicableCourses.map((course) => (
            <span key={course} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-text-muted border border-white/[0.07]">
              {course}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<CouponStatusLabel>();
        return (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_STYLE[s]}`}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </span>
        );
      },
    },
    {
      id: "expiry",
      header: "Expiry",
      cell: ({ row: { original: c } }) => (
        <div className="text-xs text-text-muted">
          <p>{formatDate(c.expiresAt)}</p>
          <p className="text-text-faint">{daysRemaining(c.expiresAt)} days left</p>
        </div>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      cell: ({ row: { original: c } }) => (
        <span className="text-sm text-text-muted font-mono">{c.usageCount} / {c.maxUsageCount}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => <span className="text-xs text-text-faint">{formatDate(getValue<string>())}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => router.push(`/dashboard/coupons/${c._id}`)} title="View" className="p-2 rounded-xl text-text-muted hover:text-[#22d3ee] hover:bg-[rgba(34,211,238,0.08)] transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => router.push(`/dashboard/coupons/${c._id}/edit`)} title="Edit" className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => toggleDisabled(c)} title={c.isDisabled ? "Enable" : "Disable"} className="p-2 rounded-xl text-text-muted hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] transition-colors">
            {c.isDisabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
          </button>
          <button onClick={() => setDel(c)} title="Delete" className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (forceStatus) {
    columns.splice(4, 0, {
      id: "expiryReason",
      header: "Why Expired",
      cell: ({ row: { original: c } }) => <span className="text-xs text-text-muted">{c.expiryReason}</span>,
    });
  }

  const table = useReactTable({
    data: coupons,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon code…"
              className="input pl-9 py-2 text-sm h-9"
            />
          </div>

          {!forceStatus && (
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatus(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    status === f.value ? "bg-primary/15 text-primary-light border border-primary/30" : "text-text-muted hover:text-text hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <select value={course} onChange={(e) => setCourse(e.target.value)} className="input py-2 text-sm h-9 w-auto">
            <option value="">All Courses</option>
            {COURSE_TIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
          <p className="text-xs text-text-faint ml-auto">{coupons.length} coupons</p>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <EmptyState title="No coupons found" description="Create your first coupon to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider select-none">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Coupon"
        description={`Delete "${deleteTarget?.code}"? It will be soft-deleted and removed from active listings, but its redemption history is kept for audit.`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
