"use client";

import { useState } from "react";
import { Plus, X, BookOpen, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BatchTable from "./BatchTable";
import BatchForm from "./BatchForm";
import LectureManager from "./LectureManager";
import HomeworkManager from "./HomeworkManager";
import type { AdminBatch } from "@/types";

type ManageTab = "lectures" | "homework";

export default function BatchManager() {
  const [formOpen, setFormOpen]       = useState(false);
  const [editing, setEditing]         = useState<AdminBatch | null>(null);
  const [manageBatch, setManageBatch] = useState<AdminBatch | null>(null);
  const [manageTab, setManageTab]     = useState<ManageTab>("lectures");
  const [refreshKey, setRefreshKey]   = useState(0);

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    setRefreshKey((k) => k + 1);
  };

  const handleEdit = (b: AdminBatch) => {
    setEditing(b);
    setFormOpen(true);
  };

  const handleManage = (b: AdminBatch) => {
    setManageBatch(b);
    setManageTab("lectures");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Batches</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage live batches, lectures, and homework</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Batch
        </button>
      </div>

      <BatchTable
        onEdit={handleEdit}
        onManage={handleManage}
        onRefresh={() => setRefreshKey((k) => k + 1)}
        refreshKey={refreshKey}
      />

      {formOpen && (
        <BatchForm
          batch={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      {/* Manage drawer */}
      <AnimatePresence>
        {manageBatch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setManageBatch(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full z-50 w-full max-w-2xl overflow-hidden flex flex-col"
              style={{ background: "#0c0c1e", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div>
                  <h2 className="text-base font-semibold text-text">{manageBatch.title}</h2>
                  <p className="text-xs text-text-faint mt-0.5">{manageBatch.instructorName}</p>
                </div>
                <button
                  onClick={() => setManageBatch(null)}
                  className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex items-center gap-1 px-6 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {([
                  { id: "lectures" as ManageTab, label: "Lectures",   Icon: BookOpen },
                  { id: "homework" as ManageTab, label: "Homework",   Icon: FileText },
                ]).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setManageTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      manageTab === id ? "text-white" : "text-text-muted hover:text-text hover:bg-white/[0.04]"
                    }`}
                    style={manageTab === id ? {
                      background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.2))",
                      border: "1px solid rgba(99,102,241,0.3)",
                    } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-6">
                {manageTab === "lectures" && <LectureManager batch={manageBatch} />}
                {manageTab === "homework" && <HomeworkManager batch={manageBatch} />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
