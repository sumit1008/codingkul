"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, LayoutDashboard, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Courses", type: "smart", dest: "/courses", anchor: "pricing" },
  { label: "DSA Sheets", type: "smart", dest: "/sheets", anchor: "sheets" },
  { label: "Pricing", type: "anchor", href: "#pricing" },
  { label: "Testimonials", type: "anchor", href: "#testimonials" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleSmartNav = (dest: string, anchor: string) => {
    if (user) {
      router.push(dest);
    } else {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else router.push("/login");
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-[9999] px-4 md:px-8 pt-4"
    >
      {/* Glow behind navbar */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-16 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div
        className={`
          relative rounded-2xl transition-all duration-300 max-w-7xl mx-auto
          ${scrolled
            ? "backdrop-blur-2xl shadow-2xl shadow-black/50"
            : "backdrop-blur-xl"
          }
        `}
        style={{
          background: scrolled
            ? "rgba(6,6,20,0.88)"
            : "rgba(8,8,24,0.72)",
          border: scrolled
            ? "1px solid rgba(99,102,241,0.22)"
            : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between px-5 md:px-7 h-16">

          {/* ── Logo ─────────────────────────────────────── */}
          <a
            href="#"
            className="flex items-center gap-3 flex-shrink-0 group"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.7)]"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 14px rgba(99,102,241,0.45)",
              }}
            >
              <Code2 className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-[17px] font-bold text-white tracking-tight select-none"
              style={{ letterSpacing: "-0.025em" }}
            >
              Codingkul
            </span>
          </a>

          {/* ── Center Nav — Desktop ──────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.type === "smart" ? (
                <button
                  key={link.label}
                  onClick={() => handleSmartNav(link.dest, link.anchor)}
                  className="relative px-4 py-2 text-sm font-medium text-[#9999bb] hover:text-white rounded-xl transition-all duration-200 hover:bg-white/[0.06] group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] rounded-full bg-indigo-400 transition-all duration-300 group-hover:w-4/5 opacity-0 group-hover:opacity-100" />
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-[#9999bb] hover:text-white rounded-xl transition-all duration-200 hover:bg-white/[0.06] group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] rounded-full bg-indigo-400 transition-all duration-300 group-hover:w-4/5 opacity-0 group-hover:opacity-100" />
                </a>
              )
            )}
          </nav>

          {/* ── Right CTA — Desktop ───────────────────────── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {!isLoading && (
              user ? (
                <Link href="/dashboard">
                  <button
                    className="flex items-center gap-2.5 h-10 px-5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.5)]"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      boxShadow: "0 0 18px rgba(99,102,241,0.35)",
                    }}
                  >
                    {user.avatar?.startsWith("http") ? (
                      <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20">
                        {user.avatar}
                      </div>
                    )}
                    Dashboard
                    <LayoutDashboard className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <button className="h-10 px-5 rounded-full text-sm font-medium text-[#9999bb] hover:text-white hover:bg-white/[0.07] transition-all duration-200">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button
                      className="flex items-center gap-1.5 h-10 px-5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.5)]"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        boxShadow: "0 0 18px rgba(99,102,241,0.35)",
                      }}
                    >
                      Get Started
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* ── Mobile Hamburger ─────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[#9999bb] hover:text-white hover:bg-white/[0.07] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="px-5 pb-5 pt-2 border-t border-white/[0.07]">
                <nav className="flex flex-col gap-0.5 mb-4 mt-2">
                  {NAV_LINKS.map((link) =>
                    link.type === "smart" ? (
                      <button
                        key={link.label}
                        onClick={() => handleSmartNav(link.dest, link.anchor)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-[#9999bb] hover:text-white rounded-xl transition-all hover:bg-white/[0.06] text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-[#9999bb] hover:text-white rounded-xl transition-all hover:bg-white/[0.06]"
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </nav>

                <div className="flex gap-3">
                  {user ? (
                    <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <button
                        className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-semibold text-white transition-all"
                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <button className="w-full h-11 rounded-2xl text-sm font-medium text-[#9999bb] hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                          Login
                        </button>
                      </Link>
                      <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <button
                          className="w-full h-11 rounded-2xl text-sm font-semibold text-white transition-all"
                          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                        >
                          Get Started
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
