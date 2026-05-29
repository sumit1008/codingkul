"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  Users, Calendar, Video, FileText, Bell, ExternalLink, Clock,
  TrendingUp, BookOpen, Award, Loader2
} from "lucide-react";
import Link from "next/link";
import { useBatchDetail } from "@/hooks/useBatch";
import BatchNav from "@/components/batch/BatchNav";
import { RingWithLabel } from "@/components/batch/BatchProgressRing";
import AnnouncementFeed from "@/components/batch/AnnouncementFeed";

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-base font-bold text-white">{value}</p>
        <p className="text-xs text-[#8888aa]">{label}</p>
      </div>
    </div>
  );
}

function CountdownBadge({ liveAt }: { liveAt: string }) {
  const diff = new Date(liveAt).getTime() - Date.now();
  if (diff <= 0) return <span className="text-xs text-[#22c55e] font-semibold">● Live now</span>;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return <span className="text-xs text-[#f59e0b]">in {Math.floor(h / 24)}d</span>;
  return <span className="text-xs text-[#22c55e]">in {h}h {m}m</span>;
}

export default function BatchHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading, error } = useBatchDetail(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05050f" }}>
        <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05050f" }}>
        <div className="text-center">
          <p className="text-lg font-bold text-white mb-2">Batch not found</p>
          <p className="text-sm text-[#8888aa]">You may not be enrolled in this batch.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-[#6366f1] hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { batch, progress, upcomingClasses, announcements, lectures, homework } = data;
  const pinnedAnn = announcements.filter((a) => a.isPinned);
  const recentLectures = lectures.slice(0, 4);
  const pendingHw = homework.filter((h) => h.status === "pending" || h.status === "in-progress").slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: batch.bannerImage
            ? `linear-gradient(to bottom, rgba(5,5,15,0.6), #05050f), url(${batch.bannerImage}) center/cover`
            : "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(5,5,15,1) 100%)",
          minHeight: "280px",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-widest mb-2">Active Batch</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">{batch.title}</h1>
            <p className="text-sm text-[#a8a8c0] mb-4 max-w-xl">{batch.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8888aa]">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{batch.enrolledStudents?.length ?? 0} students</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{progress.totalLectures} lectures</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(batch.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} – {new Date(batch.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" />{batch.instructorName}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Nav */}
        <div className="py-4">
          <BatchNav slug={slug} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
            <RingWithLabel percent={progress.progressPercent} size={100} label="Done" />
          </div>
          <StatCard icon={Video}    label="Watched"   value={`${progress.watchedCount}/${progress.totalLectures}`} color="#6366f1" />
          <StatCard icon={FileText} label="Homework"  value={`${progress.completedHomework}/${progress.totalHomework}`} color="#a855f7" />
          <StatCard icon={TrendingUp} label="Progress" value={`${progress.progressPercent}%`} color="#22d3ee" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming classes */}
            {upcomingClasses.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#22d3ee]" /> Upcoming Classes
                </h2>
                <div className="flex flex-col gap-3">
                  {upcomingClasses.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.12)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                        <p className="text-xs text-[#8888aa] mt-0.5">
                          {new Date(item.liveAt).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} ·{" "}
                          {new Date(item.liveAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} ·{" "}
                          {item.durationMinutes}min
                        </p>
                      </div>
                      <CountdownBadge liveAt={item.liveAt} />
                      {item.meetLink && (
                        <a href={item.meetLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-80"
                          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
                        >
                          Join <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent lectures */}
            {recentLectures.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#6366f1]" /> Recent Lectures
                  </h2>
                  <Link href={`/batch/${slug}/lectures`} className="text-xs text-[#6366f1] hover:underline">View all →</Link>
                </div>
                <div className="flex flex-col gap-2">
                  {recentLectures.map((l) => (
                    <Link
                      key={l._id}
                      href={`/batch/${slug}/lectures/${l._id}`}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 group transition-all hover:bg-white/[0.03]"
                      style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: l.isCompleted ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.1)" }}>
                        <Video className="w-4 h-4" style={{ color: l.isCompleted ? "#22c55e" : "#6366f1" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-[#a5b4fc] transition-colors">{l.title}</p>
                        <p className="text-xs text-[#8888aa]">{l.module} · {l.duration}min</p>
                      </div>
                      {l.isCompleted && <span className="text-xs text-[#22c55e] flex-shrink-0">✓ Done</span>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Pending homework */}
            {pendingHw.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#f59e0b]" /> Pending Homework
                  </h2>
                  <Link href={`/batch/${slug}/homework`} className="text-xs text-[#6366f1] hover:underline">View all →</Link>
                </div>
                <div className="flex flex-col gap-2">
                  {pendingHw.map((h) => (
                    <Link key={h._id} href={`/batch/${slug}/homework`}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/[0.03]"
                      style={{ border: "1px solid rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.03)" }}
                    >
                      <p className="text-sm font-medium text-white truncate">{h.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-[#f59e0b]">{h.problems.length} problems</span>
                        <span className="text-xs font-bold text-[#a855f7]">+{h.xpReward} XP</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="space-y-6">
            {/* Pinned announcements */}
            {pinnedAnn.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#a855f7]" /> Announcements
                </h2>
                <AnnouncementFeed announcements={pinnedAnn.slice(0, 2)} />
                {announcements.length > 2 && (
                  <Link href={`/batch/${slug}/announcements`} className="text-xs text-[#6366f1] hover:underline mt-2 block">View all →</Link>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
