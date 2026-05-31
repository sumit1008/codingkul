"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ClipboardList, FileText,
  Swords, Trophy, Cpu, BookMarked, Code2, Zap, X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/courses" },
  { icon: ClipboardList, label: "Homework", href: "/homework" },
  { icon: FileText, label: "DSA Sheets", href: "/sheets" },
  { icon: Swords, label: "Contests", href: "/contests" },
  { icon: Trophy, label: "Rankings", href: "/rankings" },
  { icon: Cpu, label: "Core Subjects", href: "/subjects" },
  { icon: BookMarked, label: "Notes", href: "/notes" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isFreeUser = !user || user.courseTier === "NONE";

  const content = (
    <div className="flex flex-col h-full" style={{ background: "rgba(8,8,20,0.98)" }}>
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 0 14px rgba(99,102,241,0.45)",
            }}
          >
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base" style={{ letterSpacing: "-0.02em" }}>
            Codingkul
          </span>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "#8888aa" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
              style={{
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                color: active ? "#a5b4fc" : "#8888aa",
                border: active ? "1px solid rgba(99,102,241,0.18)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
              }}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? "#6366f1" : "inherit" }}
              />
              {label}
              {active && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#6366f1" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {/* Upgrade card — free users only */}
        {isFreeUser && (
          <div
            className="mt-3 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))",
              border: "1px solid rgba(99,102,241,0.22)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] mb-3 leading-relaxed" style={{ color: "#8888aa" }}>
              Unlock all 450+ problems, live classes & mock interviews.
            </p>
            <button
              className="w-full h-8 rounded-lg text-xs font-semibold text-white transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 16px rgba(99,102,241,0.35)",
              }}
            >
              Upgrade — ₹999/mo
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 z-40 border-r"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 h-screen w-60 z-50 flex flex-col lg:hidden border-r"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
