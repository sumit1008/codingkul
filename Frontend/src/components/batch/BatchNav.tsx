"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, FileText, Bell } from "lucide-react";

const NAV = [
  { label: "Overview",      href: "",               icon: Home },
  { label: "Lectures",      href: "/lectures",      icon: Video },
  { label: "Homework",      href: "/homework",      icon: FileText },
  { label: "Announcements", href: "/announcements", icon: Bell },
];

export default function BatchNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/batch/${slug}`;

  return (
    <nav
      className="flex items-center gap-1 rounded-2xl p-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {NAV.map(({ label, href, icon: Icon }) => {
        const full = `${base}${href}`;
        const isActive = href === "" ? pathname === base : pathname.startsWith(full);
        return (
          <Link
            key={label}
            href={full}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "text-white"
                : "text-[#7878a0] hover:text-white hover:bg-white/[0.04]"
            }`}
            style={isActive ? { background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.2))", border: "1px solid rgba(99,102,241,0.3)" } : {}}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
