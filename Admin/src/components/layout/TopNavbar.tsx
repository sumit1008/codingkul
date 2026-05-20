"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, ChevronDown, Menu, Layers } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard":           "Dashboard",
  "/dashboard/sheets":    "Sheets",
  "/dashboard/problems":  "Problems",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings":  "Settings",
};

export default function TopNavbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const [open, setOpen]   = useState(false);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const breadcrumb = BREADCRUMBS[pathname] ?? pathname.split("/").pop();

  return (
    <>
      <header
        className="flex items-center justify-between px-5 lg:px-8 h-16 border-b flex-shrink-0"
        style={{ background: "rgba(8,8,22,0.95)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
      >
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobile((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-text capitalize">{breadcrumb}</h2>
          </div>
        </div>

        {/* Right: profile */}
        <div className="flex items-center gap-3" ref={ref}>
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text leading-none">{user?.name ?? "Admin"}</p>
                <p className="text-[10px] text-text-faint mt-0.5 capitalize">{user?.role ?? "admin"}</p>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-text-muted transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                style={{ background: "#0d0d22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.8)" }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-sm font-semibold text-text">{user?.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text hover:bg-white/[0.06] transition-colors">
                      <User className="w-4 h-4" /> Account Settings
                    </button>
                  </Link>
                  <div className="my-1 h-px mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobile && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobile(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside
            className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: "#080816", borderRight: "1px solid rgba(255,255,255,0.07)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                <Layers className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold text-text">AlgoShashtra Admin</p>
            </div>
            <nav className="flex-1 py-5 px-3 space-y-0.5">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Sheets", href: "/dashboard/sheets" },
                { label: "Problems", href: "/dashboard/problems" },
                { label: "Analytics", href: "/dashboard/analytics" },
                { label: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobile(false)}>
                  <div className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    pathname.startsWith(item.href) ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text hover:bg-white/5"
                  )}>
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
