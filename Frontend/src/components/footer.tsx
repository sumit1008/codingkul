"use client";

import { Code2, GitBranch, X, Link2, Play } from "lucide-react";

const LINKS = {
  Product: ["Problems", "DSA Sheets", "Live Classes", "Contests", "Pricing"],
  Resources: ["Blog", "Editorials", "Roadmaps", "Cheat Sheets", "Interview Q&A"],
  Company: ["About", "Careers", "Contact", "Press Kit", "Privacy Policy"],
};

const SOCIALS = [
  { icon: GitBranch, href: "#", label: "GitHub" },
  { icon: X, href: "#", label: "Twitter/X" },
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Play, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t px-4 pt-16 pb-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 0 16px rgba(99,102,241,0.4)",
                }}
              >
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                Codingkul
              </span>
            </a>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#8888aa" }}>
              India&apos;s most structured DSA platform. Built for engineers
              who want to crack top tech companies.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#8888aa",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(99,102,241,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#a5b4fc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white mb-4 tracking-wider uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#8888aa" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "#8888aa" }}>
            © 2026 Codingkul. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "#8888aa" }}>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
