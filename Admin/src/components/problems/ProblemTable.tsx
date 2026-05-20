"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import {
  Pencil, Trash2, Search, ChevronLeft, ChevronRight,
  Loader2, ExternalLink, Filter, X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { difficultyColor, formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import type { Problem } from "@/types";
import { DIFFICULTIES, PLATFORMS, TOPICS } from "@/types";

interface Props { onRefresh: () => void; }

export default function ProblemTable({ onRefresh }: Props) {
  const [problems, setProblems]       = useState<Problem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [globalFilter, setFilter]     = useState("");
  const [sorting, setSorting]         = useState<SortingState>([]);
  const [rowSelection, setSelection]  = useState<Record<string, boolean>>({});
  const [deleteTarget, setDel]        = useState<Problem | null>(null);
  const [bulkDelOpen, setBulkDel]     = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]         = useState({ difficulty: "", topic: "", platform: "" });
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const LIMIT = 25;

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(LIMIT));
    if (globalFilter)       p.set("q", globalFilter);
    if (filters.difficulty) p.set("difficulty", filters.difficulty);
    if (filters.topic)      p.set("topic", filters.topic);
    if (filters.platform)   p.set("platform", filters.platform);
    return p.toString();
  }, [page, globalFilter, filters]);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setSelection({});
    try {
      const r = await fetch(`/api/problems?${buildQuery()}`);
      const j = await r.json();
      setProblems(j.data?.problems ?? []);
      setTotal(j.data?.pagination?.total ?? 0);
    } catch { toast.error("Failed to load problems"); }
    finally  { setLoading(false); }
  }, [buildQuery]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  // reset page when filter changes
  useEffect(() => { setPage(1); }, [globalFilter, filters]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/problems/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error); return; }
      toast.success("Problem deleted");
      setDel(null);
      fetchProblems();
      onRefresh();
    } catch { toast.error("Delete failed"); }
    finally  { setDeleting(false); }
  };

  const confirmBulkDelete = async () => {
    const ids = Object.keys(rowSelection).map((i) => problems[Number(i)]?._id).filter(Boolean);
    setDeleting(true);
    try {
      const r = await fetch("/api/problems/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error); return; }
      toast.success(j.message);
      setBulkDel(false);
      setSelection({});
      fetchProblems();
      onRefresh();
    } catch { toast.error("Bulk delete failed"); }
    finally  { setDeleting(false); }
  };

  const columns: ColumnDef<Problem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 rounded accent-primary"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4 rounded accent-primary"
        />
      ),
      size: 40,
    },
    {
      accessorKey: "title",
      header: "Problem",
      cell: ({ row: { original: p } }) => (
        <div>
          <p className="text-sm font-medium text-text">{p.title}</p>
          <p className="text-xs text-text-faint mt-0.5">{p.topic}{p.sheetTitle ? ` · ${p.sheetTitle}` : ""}</p>
        </div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Diff",
      cell: ({ getValue }) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${difficultyColor(getValue<string>())}`}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ getValue }) => <span className="text-xs text-text-muted">{getValue<string>()}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: ({ getValue }) => <span className="text-xs text-text-faint">{formatDate(getValue<string>())}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center gap-1 justify-end">
          {p.problemUrl && (
            <a href={p.problemUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <Link href={`/dashboard/problems/${p._id}`}>
            <button className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button onClick={() => setDel(p)} className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: problems,
    columns,
    state: { globalFilter, sorting, rowSelection },
    onGlobalFilterChange: setFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / LIMIT),
  });

  const selectedCount = Object.keys(rowSelection).length;
  const totalPages    = Math.ceil(total / LIMIT);

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Toolbar */}
        <div className="px-5 py-4 border-b space-y-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
              <input
                value={globalFilter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search problems…"
                className="input pl-9 py-2 text-sm h-9"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                showFilters ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text hover:bg-white/5"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
              {(filters.difficulty || filters.topic || filters.platform) && (
                <span className="w-2 h-2 rounded-full bg-primary ml-0.5" />
              )}
            </button>
            {selectedCount > 0 && (
              <button onClick={() => setBulkDel(true)} className="btn-danger flex items-center gap-1.5 py-1.5 text-sm">
                <Trash2 className="w-3.5 h-3.5" /> Delete {selectedCount}
              </button>
            )}
            {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
            <span className="text-xs text-text-faint ml-auto">{total} problems</span>
          </div>

          {showFilters && (
            <div className="flex gap-3 flex-wrap items-center">
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                className="input py-1.5 h-9 text-sm max-w-[140px]"
              >
                <option value="">All difficulties</option>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={filters.platform}
                onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value }))}
                className="input py-1.5 h-9 text-sm max-w-[160px]"
              >
                <option value="">All platforms</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={filters.topic}
                onChange={(e) => setFilters((f) => ({ ...f, topic: e.target.value }))}
                className="input py-1.5 h-9 text-sm max-w-[180px]"
              >
                <option value="">All topics</option>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {(filters.difficulty || filters.topic || filters.platform) && (
                <button
                  onClick={() => setFilters({ difficulty: "", topic: "", platform: "" })}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-danger transition-colors"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <EmptyState title="No problems found" description="Try adjusting your search or filters" />
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
                        className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider select-none"
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
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-xs text-text-faint">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Problem"
        description={`Permanently delete "${deleteTarget?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
      <ConfirmDialog
        open={bulkDelOpen}
        title={`Delete ${selectedCount} Problems`}
        description={`Permanently delete ${selectedCount} selected problems? This cannot be undone.`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDel(false)}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
