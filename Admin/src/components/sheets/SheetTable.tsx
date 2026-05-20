"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { Pencil, Trash2, Eye, EyeOff, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import type { Sheet } from "@/types";

interface Props { onEdit: (s: Sheet) => void; onRefresh: () => void; }

export default function SheetTable({ onEdit, onRefresh }: Props) {
  const [sheets, setSheets]     = useState<Sheet[]>([]);
  const [loading, setLoading]   = useState(true);
  const [globalFilter, setFilter] = useState("");
  const [sorting, setSorting]   = useState<SortingState>([]);
  const [deleteTarget, setDel]  = useState<Sheet | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSheets = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/sheets?limit=100");
      const j = await r.json();
      setSheets(j.data?.sheets ?? []);
    } catch { toast.error("Failed to load sheets"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchSheets(); }, [fetchSheets]);

  const togglePublish = async (sheet: Sheet) => {
    try {
      await fetch(`/api/sheets/${sheet._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !sheet.isPublished }),
      });
      toast.success(`Sheet ${sheet.isPublished ? "unpublished" : "published"}`);
      fetchSheets();
      onRefresh();
    } catch { toast.error("Failed to update"); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/sheets/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error); return; }
      toast.success("Sheet deleted");
      setDel(null);
      fetchSheets();
      onRefresh();
    } catch { toast.error("Delete failed"); }
    finally   { setDeleting(false); }
  };

  const columns: ColumnDef<Sheet>[] = [
    {
      accessorKey: "title",
      header: "Sheet",
      cell: ({ row: { original: s } }) => (
        <div>
          <p className="text-sm font-medium text-text">{s.title}</p>
          <p className="text-xs text-text-faint mt-0.5 font-mono">{s.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "totalProblems",
      header: "Problems",
      cell: ({ getValue }) => <span className="text-sm text-text">{getValue<number>()}</span>,
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ getValue }) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
          getValue<boolean>()
            ? "text-success bg-success-bg border border-success/20"
            : "text-text-muted bg-bg-elevated border border-white/10"
        }`}>
          {getValue<boolean>() ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      accessorKey: "isPremium",
      header: "Tier",
      cell: ({ getValue }) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          getValue<boolean>() ? "text-accent bg-accent/10" : "text-text-muted bg-bg-elevated"
        }`}>
          {getValue<boolean>() ? "Premium" : "Free"}
        </span>
      ),
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ getValue }) => <span className="text-sm text-text-muted">{getValue<number>()}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => <span className="text-xs text-text-faint">{formatDate(getValue<string>())}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: s } }) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => togglePublish(s)}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors"
            title={s.isPublished ? "Unpublish" : "Publish"}
          >
            {s.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => onEdit(s)} className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => setDel(s)} className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sheets,
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
        {/* Search */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
            <input
              value={globalFilter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search sheets…"
              className="input pl-9 py-2 text-sm h-9"
            />
          </div>
          {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : sheets.length === 0 ? (
          <EmptyState title="No sheets yet" description="Create your first DSA sheet to get started" />
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
        title="Delete Sheet"
        description={`Delete "${deleteTarget?.title}"? This will unlink all its problems but not delete them.`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
