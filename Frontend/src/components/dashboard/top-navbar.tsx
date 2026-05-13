"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, Flame, Zap, Trophy, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click — avoids the fixed-inside-backdropFilter bug
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header
      className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
      style={{
        background: "rgba(5,5,16,0.98)",
        borderColor: "rgba(255,255,255,0.06)",
        zIndex: 40,
        position: "relative",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl transition-colors hover:bg-white/5 shrink-0"
        style={{ color: "#8888aa" }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: searchFocus ? "#6366f1" : "#555577" }}
        />
        <input
          type="text"
          placeholder="Search problems, topics..."
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm placeholder-[#555577] text-[#e8e8f0] outline-none transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: searchFocus ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: searchFocus ? "0 0 0 3px rgba(99,102,241,0.08)" : "none",
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Streak */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#fb923c" }}
        >
          <Flame className="w-3.5 h-3.5" />
          {user?.streak ?? 0}d
        </div>

        {/* XP */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", color: "#facc15" }}
        >
          <Zap className="w-3.5 h-3.5" />
          {user?.xp.toLocaleString() ?? 0} XP
        </div>

        {/* Rank */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}
        >
          <Trophy className="w-3.5 h-3.5" />
          #{user?.rank ?? 0}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "#8888aa" }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#6366f1" }} />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors hover:bg-white/5"
          >
            {user?.avatar?.startsWith("http") ? (
              <img
                src={user.avatar}
                alt={user.name ?? "avatar"}
                className="w-7 h-7 rounded-lg shrink-0 object-cover"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {user?.avatar ?? "?"}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-white">
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform duration-200"
              style={{ color: "#8888aa", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden"
              style={{
                background: "#0d0d20",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)",
                zIndex: 9999,
              }}
            >
              {/* User info */}
              <div className="px-4 py-3.5 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {user?.avatar?.startsWith("http") ? (
                  <img src={user.avatar} alt={user.name ?? "avatar"} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    {user?.avatar ?? "?"}
                  </div>
                )}
                <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>@{user?.username}</p>
                <div
                  className="flex items-center gap-1.5 mt-2 text-[11px] font-medium px-2 py-1 rounded-lg w-fit"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}
                >
                  Level {user?.level} · {user?.title}
                </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5 px-1.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors w-full"
                  style={{ color: "#aaaacc" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#aaaacc";
                  }}
                >
                  <User className="w-4 h-4 shrink-0" />
                  Profile
                </Link>

                <div className="my-1 h-px mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors w-full text-left"
                  style={{ color: "#f87171" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                  }}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
