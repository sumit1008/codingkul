"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Courses", href: "#courses" },
  { label: "DSA Sheets", href: "#sheets" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 inset-x-4 md:inset-x-8 z-50"
    >
      <div
        className={`
          rounded-2xl px-4 md:px-6 py-3 transition-all duration-300
          ${scrolled ? "glass-strong shadow-lg shadow-black/40" : "glass"}
        `}
        style={{
          border: scrolled
            ? "1px solid rgba(99,102,241,0.2)"
            : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 16px rgba(99,102,241,0.5)",
              }}
            >
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-lg tracking-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Codingkul
            </span>
          </a>

          {/* Center nav — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#8888aa] hover:text-white rounded-xl transition-colors duration-200 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm text-[#8888aa] hover:text-white hover:bg-white/5 px-4 h-9 rounded-xl"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="text-sm px-4 h-9 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                }}
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#8888aa] hover:text-white transition-colors p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 pt-3 border-t border-white/8"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-[#8888aa] hover:text-white rounded-xl transition-colors hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-3 pb-1">
              <Button
                variant="ghost"
                className="flex-1 text-sm text-[#8888aa] hover:text-white hover:bg-white/5 h-9 rounded-xl"
              >
                Login
              </Button>
              <Button
                className="flex-1 text-sm h-9 rounded-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                }}
              >
                Sign Up
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
