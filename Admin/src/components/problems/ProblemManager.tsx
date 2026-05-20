"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import ProblemTable from "./ProblemTable";
import CsvImport from "./CsvImport";

export default function ProblemManager() {
  const [csvOpen, setCsvOpen]       = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Problems</h1>
          <p className="text-text-muted text-sm mt-1">Manage all DSA problems</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCsvOpen(true)}
            className="btn-ghost flex items-center gap-2 border border-white/10"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <Link href="/dashboard/problems/new">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Problem
            </button>
          </Link>
        </div>
      </div>

      <ProblemTable key={refreshKey} onRefresh={() => setRefreshKey((k) => k + 1)} />

      {csvOpen && (
        <CsvImport
          onClose={() => setCsvOpen(false)}
          onImported={() => { setCsvOpen(false); setRefreshKey((k) => k + 1); }}
        />
      )}
    </div>
  );
}
