"use client";

import { useState } from "react";
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="flex items-center gap-3 px-5 py-3 border-b flex-shrink-0"
      style={{
        background: "rgba(5,5,16,0.95)",
        borderColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl transition-colors hover:bg-white/5 flex-shrink-0"
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
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.2)",
            color: "#fb923c",
          }}
        >
          <Flame className="w-3.5 h-3.5" />
          {user?.streak ?? 0}d
        </div>

        {/* XP */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.2)",
            color: "#facc15",
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          {user?.xp.toLocaleString() ?? 0} XP
        </div>

        {/* Rank */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#a5b4fc",
          }}
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
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#6366f1" }}
          />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors hover:bg-white/5"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              {user?.avatar ?? "?"}
            </div>
            <span className="hidden md:block text-sm font-medium text-white">
              {user?.name.split(" ")[0]}
            </span>
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform"
              style={{ color: "#8888aa", transform: profileOpen ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl py-1.5 z-20"
                style={{
                  background: "rgba(12,12,28,0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs" style={{ color: "#8888aa" }}>@{user?.username}</p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 text-left"
                    style={{ color: "#8888aa" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#e8e8f0"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8888aa"; }}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-500/10 text-left text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
