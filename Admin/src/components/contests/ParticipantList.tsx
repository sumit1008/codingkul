"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Trophy, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { AdminContest, ContestParticipant } from "@/types";

interface Props {
  contest: AdminContest;
  onClose: () => void;
}

export default function ParticipantList({ contest, onClose }: Props) {
  const [participants, setParticipants] = useState<ContestParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`/api/contests/${contest._id}/participants`);
        const j = await r.json();
        if (!r.ok) { toast.error(j.error ?? "Failed to load"); return; }
        setParticipants(j.data?.results ?? []);
        setTotal(j.data?.total ?? 0);
      } catch { toast.error("Network error"); }
      finally { setLoading(false); }
    };
    load();
  }, [contest._id]);

  const rankColor = (rank: number) => {
    if (rank === 1) return "text-[#fbbf24]";
    if (rank === 2) return "text-[#9ca3af]";
    if (rank === 3) return "text-[#cd7c2f]";
    return "text-text-muted";
  };

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
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
          style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
                <Users className="w-4 h-4 text-[#a5b4fc]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-text">{contest.title}</h2>
                <p className="text-xs text-text-faint">{total} participants</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
              </div>
            ) : participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Trophy className="w-10 h-10 text-text-faint opacity-30" />
                <p className="text-text-muted text-sm">No participants yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Rank", "CF Handle", "User", "Solved", "Penalty", "Rating Δ", "XP Earned"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr
                      key={p._id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="px-5 py-3">
                        <span className={`text-sm font-bold ${rankColor(p.globalRank)}`}>
                          #{p.globalRank}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-mono text-[#6366f1]">{p.cfHandle}</span>
                      </td>
                      <td className="px-5 py-3">
                        {p.userId ? (
                          <div>
                            <p className="text-sm text-text">{p.userId.fullName}</p>
                            <p className="text-xs text-text-faint">{p.userId.username}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-text-faint italic">Unlinked</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-text">{p.solved}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-text-muted">{p.penalty}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-semibold ${p.ratingChange >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {p.ratingChange >= 0 ? "+" : ""}{p.ratingChange}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold text-[#a855f7]">{p.xpEarned} XP</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-text-faint">Showing top {Math.min(200, participants.length)} of {total} participants</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
