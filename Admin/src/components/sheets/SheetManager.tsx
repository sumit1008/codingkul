"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SheetTable from "./SheetTable";
import SheetForm from "./SheetForm";
import type { Sheet } from "@/types";

export default function SheetManager() {
  const [formOpen, setFormOpen]         = useState(false);
  const [editing, setEditing]           = useState<Sheet | null>(null);
  const [refreshKey, setRefreshKey]     = useState(0);

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit   = (s: Sheet) => { setEditing(s); setFormOpen(true); };
  const handleClose  = () => { setFormOpen(false); setEditing(null); };
  const handleSaved  = () => { handleClose(); setRefreshKey((k) => k + 1); };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Sheets</h1>
          <p className="text-text-muted text-sm mt-1">Manage DSA learning paths</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Sheet
        </button>
      </div>

      <SheetTable key={refreshKey} onEdit={handleEdit} onRefresh={() => setRefreshKey((k) => k + 1)} />

      {formOpen && (
        <SheetForm sheet={editing} onClose={handleClose} onSaved={handleSaved} />
      )}
    </div>
  );
}
