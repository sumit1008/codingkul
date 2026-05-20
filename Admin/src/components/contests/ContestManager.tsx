"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ContestTable from "./ContestTable";
import ContestForm from "./ContestForm";
import ContestAnalyticsView from "./ContestAnalyticsView";
import ParticipantList from "./ParticipantList";
import type { AdminContest } from "@/types";

export default function ContestManager() {
  const [formOpen, setFormOpen]           = useState(false);
  const [editing, setEditing]             = useState<AdminContest | null>(null);
  const [participants, setParticipants]   = useState<AdminContest | null>(null);
  const [refreshKey, setRefreshKey]       = useState(0);

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit   = (c: AdminContest) => { setEditing(c); setFormOpen(true); };
  const handleClose  = () => { setFormOpen(false); setEditing(null); };
  const handleSaved  = () => { handleClose(); setRefreshKey((k) => k + 1); };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Contest Arena</h1>
          <p className="text-text-muted text-sm mt-1">Manage AlgoShashtra contests and results</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Contest
        </button>
      </div>

      <ContestAnalyticsView key={`stats-${refreshKey}`} />

      <ContestTable
        key={refreshKey}
        onEdit={handleEdit}
        onViewParticipants={(c) => setParticipants(c)}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />

      {formOpen && (
        <ContestForm contest={editing} onClose={handleClose} onSaved={handleSaved} />
      )}

      {participants && (
        <ParticipantList contest={participants} onClose={() => setParticipants(null)} />
      )}
    </div>
  );
}
