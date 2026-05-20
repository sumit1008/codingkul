"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import { difficultyColor } from "@/lib/utils";
import type { Sheet } from "@/types";
import { useEffect } from "react";

interface ParsedRow {
  title: string;
  difficulty: string;
  topic: string;
  platform: string;
  problemUrl?: string;
  editorialUrl?: string;
  videoUrl?: string;
  tags?: string;
  companies?: string;
  order?: string;
  _valid: boolean;
  _error?: string;
}

interface Props { onClose: () => void; onImported: () => void; }

export default function CsvImport({ onClose, onImported }: Props) {
  const [rows, setRows]         = useState<ParsedRow[]>([]);
  const [sheets, setSheets]     = useState<Sheet[]>([]);
  const [sheetId, setSheetId]   = useState("");
  const [uploading, setUpload]  = useState(false);
  const [result, setResult]     = useState<{ inserted: number; duplicates: number; errors: string[] } | null>(null);
  const fileRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/sheets?limit=100").then((r) => r.json()).then((j) => setSheets(j.data?.sheets ?? []));
  }, []);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { toast.error("Please upload a .csv file"); return; }
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed: ParsedRow[] = data.map((row) => {
          const r = row as Record<string, string>;
          const errors: string[] = [];
          if (!r.title)      errors.push("title required");
          if (!r.difficulty) errors.push("difficulty required");
          if (!["Easy","Medium","Hard"].includes(r.difficulty)) errors.push("difficulty must be Easy/Medium/Hard");
          if (!r.topic)      errors.push("topic required");
          return { ...r, _valid: errors.length === 0, _error: errors.join(", ") } as ParsedRow;
        });
        setRows(parsed);
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    const valid = rows.filter((r) => r._valid);
    if (valid.length === 0) { toast.error("No valid rows to import"); return; }
    setUpload(true);
    try {
      const r = await fetch("/api/upload/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: valid.map(({ _valid, _error, ...rest }) => rest), sheetId: sheetId || undefined }),
      });
      const j = await r.json();
      if (!r.ok) { toast.error(j.error); return; }
      setResult(j.data);
    } catch { toast.error("Import failed"); }
    finally  { setUpload(false); }
  };

  const downloadTemplate = () => {
    const header = "title,difficulty,topic,platform,problemUrl,editorialUrl,videoUrl,tags,companies,order";
    const sample = "Two Sum,Easy,Arrays,LeetCode,https://leetcode.com/problems/two-sum/,,,sliding window,Google Amazon,1";
    const blob   = new Blob([`${header}\n${sample}\n`], { type: "text/csv" });
    const a      = document.createElement("a");
    a.href       = URL.createObjectURL(blob);
    a.download   = "problems-template.csv";
    a.click();
  };

  const validCount   = rows.filter((r) => r._valid).length;
  const invalidCount = rows.filter((r) => !r._valid).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
          style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div>
              <h2 className="text-base font-semibold text-text">Import Problems via CSV</h2>
              <p className="text-xs text-text-muted mt-0.5">Upload a CSV with problem data</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={downloadTemplate} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
                <Download className="w-3.5 h-3.5" /> Template
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {result ? (
              /* Result screen */
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">Import complete!</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {result.inserted} inserted · {result.duplicates} duplicates skipped
                    </p>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-xs font-semibold text-danger mb-2">Errors ({result.errors.length})</p>
                    <ul className="space-y-1">
                      {result.errors.map((e, i) => <li key={i} className="text-xs text-text-muted">{e}</li>)}
                    </ul>
                  </div>
                )}
                <button onClick={onImported} className="btn-primary w-full">Done</button>
              </div>
            ) : (
              <>
                {/* Upload zone */}
                {rows.length === 0 && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors hover:border-primary/40"
                    style={{ borderColor: "rgba(255,255,255,0.12)" }}
                  >
                    <Upload className="w-10 h-10 text-text-faint mx-auto mb-3" />
                    <p className="text-sm font-medium text-text mb-1">Drop your CSV here or click to browse</p>
                    <p className="text-xs text-text-faint">Supports up to 500 rows</p>
                    <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                  </div>
                )}

                {/* Preview */}
                {rows.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-success">
                          <CheckCircle className="w-4 h-4" /> {validCount} valid
                        </div>
                        {invalidCount > 0 && (
                          <div className="flex items-center gap-1.5 text-sm text-danger">
                            <AlertCircle className="w-4 h-4" /> {invalidCount} invalid
                          </div>
                        )}
                      </div>
                      <button onClick={() => setRows([])} className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Change file
                      </button>
                    </div>

                    {/* Sheet selector */}
                    <div>
                      <label className="label">Assign to Sheet (optional)</label>
                      <select value={sheetId} onChange={(e) => setSheetId(e.target.value)} className="input max-w-xs">
                        <option value="">No sheet</option>
                        {sheets.map((s) => <option key={s._id} value={s._id}>{s.title}</option>)}
                      </select>
                    </div>

                    {/* Preview table */}
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="overflow-x-auto max-h-64">
                        <table className="w-full text-xs">
                          <thead>
                            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold"></th>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold">Title</th>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold">Difficulty</th>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold">Topic</th>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold">Platform</th>
                              <th className="px-3 py-2 text-left text-text-muted font-semibold">Issue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.slice(0, 50).map((row, i) => (
                              <tr key={i} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                <td className="px-3 py-2">
                                  {row._valid
                                    ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                                    : <AlertCircle className="w-3.5 h-3.5 text-danger" />
                                  }
                                </td>
                                <td className="px-3 py-2 text-text font-medium max-w-[200px] truncate">{row.title}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 rounded-full font-semibold ${difficultyColor(row.difficulty)}`}>{row.difficulty}</span>
                                </td>
                                <td className="px-3 py-2 text-text-muted">{row.topic}</td>
                                <td className="px-3 py-2 text-text-muted">{row.platform}</td>
                                <td className="px-3 py-2 text-danger">{row._error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {rows.length > 50 && (
                        <div className="px-3 py-2 text-xs text-text-faint" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                          Showing first 50 of {rows.length} rows
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={uploading || validCount === 0}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Import {validCount} Problems
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
