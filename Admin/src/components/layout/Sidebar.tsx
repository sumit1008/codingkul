"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileSpreadsheet, Code2, BarChart2,
  Settings, ChevronRight, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",  href: "/dashboard",           icon: LayoutDashboard },
  { label: "Sheets",     href: "/dashboard/sheets",    icon: FileSpreadsheet },
  { label: "Problems",   href: "/dashboard/problems",  icon: Code2 },
  { label: "Analytics",  href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Settings",   href: "/dashboard/settings",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r"
      style={{ background: "#080816", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 h-16 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 0 14px rgba(99,102,241,0.45)" }}
        >
          <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold text-text tracking-tight leading-none">AlgoShashtra</p>
          <p className="text-[10px] text-text-faint mt-0.5">Admin CMS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary-light"
                    : "text-text-muted hover:text-text hover:bg-white/[0.05]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
                )}
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] text-text-faint">v0.1.0 · AlgoShashtra CMS</p>
      </div>
    </aside>
  );
}
