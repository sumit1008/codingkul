"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, FileText, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { label: "Landing", icon: Home, href: "#" },
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "Sheets", icon: FileText, href: "#sheets" },
  { label: "Courses", icon: BookOpen, href: "#courses" },
];

export default function FloatingNav() {
  const [active, setActive] = useState("Landing");

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 600) setActive("Landing");
      else if (scrollY < 1800) setActive("Dashboard");
      else if (scrollY < 3000) setActive("Sheets");
      else setActive("Courses");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2"
    >
      <div className="glass rounded-2xl p-2 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActive(item.label)}
              className="group relative flex items-center justify-center"
            >
              <motion.div
                animate={
                  isActive
                    ? {
                        boxShadow: "0 0 12px rgba(99,102,241,0.5)",
                      }
                    : {
                        boxShadow: "none",
                      }
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid transparent",
                }}
              >
                <Icon
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isActive ? "text-indigo-400" : "text-[#8888aa] group-hover:text-white"
                  }`}
                />
              </motion.div>

              {/* Tooltip */}
              <div className="absolute right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
