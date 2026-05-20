"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { Pencil, Trash2, Search, Loader2, RefreshCw, Users, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import type { AdminContest } from "@/types";

interface Props {
  onEdit: (c: AdminContest) => void;
  onViewParticipants: (c: AdminContest) => void;
  onRefresh: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  upcoming:  "text-[#6366f1] bg-[rgba(99,102,241,0.12)] border-[rgba(99,102,241,0.25)]",
  running:   "text-[#22c55e] bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.25)]",
  completed: "text-[#8888aa] bg-[rgba(136,136,170,0.08)] border-[rgba(136,136,170,0.2)]",
};

const DIFF_STYLE: Record<string, string> = {
  Beginner:     "text-[#22c55e] bg-[rgba(34,197,94,0.1)]",
  Intermediate: "text-[#f59e0b] bg-[rgba(245,158,11,0.1)]",
  Advanced:     "text-[#ef4444] bg-[rgba(239,68,68,0.1)]",
};

export default function ContestTable({ onEdit, onViewParticipants, onRefresh }: Props) {
  const [contests, setContests]   = useState<AdminContest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [globalFilter, setFilter] = useState("");
  const [sorting, setSorting]     = useState<SortingState>([]);
  const [deleteTarget, setDel]    = useState<AdminContest | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [syncing, setSyncing]     = useState<string | null>(null);
  const [reprocessing, setReproc] = useState<string | null>(null);

  const fetchContests = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/contests?limit=100");
      const j = await r.json();
      setContests(j.data?.contests ?? []);
    } catch { toast.error("Failed to load contests"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchContests(); }, [fetchContests]);

  const handleSync = async (contest: AdminContest) => {
    setSyncing(contest._id);
    try {
      const r = await fetch(`/api/contests/${contest._id}/sync`, { method: "POST" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Sync failed"); return; }
      toast.success(j.message ?? "Status synced");
      fetchContests();
      onRefresh();
    } catch { toast.error("Sync failed"); }
    finally { setSyncing(null); }
  };

  const handleReprocess = async (contest: AdminContest) => {
    if (contest.status !== "completed") {
      toast.error("Contest must be completed to reprocess");
      return;
    }
    setReproc(contest._id);
    try {
      const r = await fetch(`/api/contests/${contest._id}/reprocess`, { method: "POST" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Reprocess failed"); return; }
      toast.success(j.message ?? "Flagged for reprocessing");
      fetchContests();
    } catch { toast.error("Reprocess failed"); }
    finally { setReproc(null); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/contests/${deleteTarget._id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error ?? "Delete failed"); return; }
      toast.success("Contest deleted");
      setDel(null);
      fetchContests();
      onRefresh();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  const columns: ColumnDef<AdminContest>[] = [
    {
      accessorKey: "title",
      header: "Contest",
      cell: ({ row: { original: c } }) => (
        <div>
          <p className="text-sm font-medium text-text">{c.title}</p>
          <p className="text-xs text-text-faint mt-0.5 font-mono">CF #{c.codeforcesContestId}</p>
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="text-xs text-text-muted">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<string>();
        return (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_STYLE[s] ?? ""}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ getValue }) => {
        const d = getValue<string>();
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${DIFF_STYLE[d] ?? ""}`}>
            {d}
          </span>
        );
      },
    },
    {
      accessorKey: "xpReward",
      header: "XP",
      cell: ({ getValue }) => (
        <span className="text-xs font-semibold text-[#a855f7]">{getValue<number>()} XP</span>
      ),
    },
    {
      accessorKey: "processedResults",
      header: "Results",
      cell: ({ getValue }) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          getValue<boolean>()
            ? "text-[#22c55e] bg-[rgba(34,197,94,0.1)]"
            : "text-text-muted bg-bg-elevated"
        }`}>
          {getValue<boolean>() ? "Processed" : "Pending"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onViewParticipants(c)}
            title="View participants"
            className="p-2 rounded-xl text-text-muted hover:text-[#22d3ee] hover:bg-[rgba(34,211,238,0.08)] transition-colors"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSync(c)}
            disabled={syncing === c._id}
            title="Sync status from Codeforces"
            className="p-2 rounded-xl text-text-muted hover:text-[#22c55e] hover:bg-[rgba(34,197,94,0.08)] transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${syncing === c._id ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => handleReprocess(c)}
            disabled={reprocessing === c._id || c.status !== "completed"}
            title="Reprocess results"
            className="p-2 rounded-xl text-text-muted hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] transition-colors disabled:opacity-40"
          >
            <RotateCcw className={`w-4 h-4 ${reprocessing === c._id ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => onEdit(c)}
            className="p-2 rounded-xl text-text-muted hover:text-primary-light hover:bg-primary/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDel(c)}
            className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: contests,
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
              placeholder="Search contests…"
              className="input pl-9 py-2 text-sm h-9"
            />
          </div>
          {loading && <Loader2 className="w-4 h-4 text-text-faint animate-spin" />}
          <p className="text-xs text-text-faint ml-auto">{contests.length} contests</p>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : contests.length === 0 ? (
          <EmptyState title="No contests yet" description="Create your first contest to get started" />
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
        title="Delete Contest"
        description={`Delete "${deleteTarget?.title}"? This will also remove all participant results. Contests with processed results cannot be deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
