"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { Pencil, Trash2, Search, Loader2, Users, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import type { AdminBatch } from "@/types";

interface Props {
  onEdit:       (b: AdminBatch) => void;
  onManage:     (b: AdminBatch) => void;
  onRefresh:    () => void;
  refreshKey:   number;
}

export default function BatchTable({ onEdit, onManage, onRefresh, refreshKey }: Props) {
  const [batches, setBatches]   = useState<AdminBatch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [globalFilter, setFilter] = useState("");
  const [sorting, setSorting]   = useState<SortingState>([]);
  const [deleteTarget, setDel]  = useState<AdminBatch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/batches?limit=100");
      const j = await r.json();
      setBatches(j.data?.batches ?? []);
    } catch { toast.error("Failed to load batches"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches, refreshKey]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/batches/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Batch and all related data deleted");
      setDel(null);
      fetchBatches();
      onRefresh();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  const columns: ColumnDef<AdminBatch>[] = [
    {
      accessorKey: "title",
      header: "Batch",
      cell: ({ row: { original: b } }) => (
        <div>
          <p className="text-sm font-medium text-text">{b.title}</p>
          <p className="text-xs text-text-faint mt-0.5 font-mono">{b.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "instructorName",
      header: "Instructor",
      cell: ({ getValue }) => (
        <span className="text-xs text-text-muted">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Dates",
      cell: ({ row: { original: b } }) => (
        <div className="text-xs text-text-muted">
          <p>{formatDate(b.startDate)}</p>
          <p className="text-text-faint">→ {formatDate(b.endDate)}</p>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
          getValue<boolean>()
            ? "text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]"
            : "text-text-muted bg-bg-elevated border-[rgba(255,255,255,0.08)]"
        }`}>
          {getValue<boolean>() ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "counts",
      header: "Content",
      cell: ({ row: { original: b } }) => (
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />{b.lectureCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />{b.hwCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />{b.studentCount ?? 0}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: b } }) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onManage(b)}
            title="Manage lectures & homework"
            className="p-2 rounded-xl text-text-muted hover:text-[#22d3ee] hover:bg-[rgba(34,211,238,0.08)] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(b)}
            className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDel(b)}
            className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: batches,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
            <input
              value={globalFilter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search batches…"
              className="input pl-9 py-2 text-sm h-9"
            />
          </div>
          {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
          <p className="text-xs text-text-faint ml-auto">{batches.length} batches</p>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : batches.length === 0 ? (
          <EmptyState title="No batches yet" description="Create your first batch to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        onClick={h.column.getToggleSortingHandler()}
                        className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider select-none"
                        style={{ cursor: h.column.getCanSort() ? "pointer" : "default" }}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
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
        title="Delete Batch"
        description={`Delete "${deleteTarget?.title}"? This will permanently delete all lectures, homework, and related data.`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
