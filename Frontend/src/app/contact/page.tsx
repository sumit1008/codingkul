"use client";

import Link from "next/link";
import { Mail, Phone, ArrowLeft, Code2, MessageSquare, Handshake, Wrench, HelpCircle } from "lucide-react";

const CONTACT_PURPOSES = [
  { icon: <MessageSquare className="w-4 h-4" />, label: "Business Enquiries" },
  { icon: <HelpCircle className="w-4 h-4" />, label: "General Queries" },
  { icon: <Handshake className="w-4 h-4" />, label: "Partnerships" },
  { icon: <Wrench className="w-4 h-4" />, label: "Technical Support" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "#050510" }}>
      {/* Minimal top bar */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
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
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm transition-colors duration-200"
          style={{ color: "#8888aa" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8e8f0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Page content */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Contact Us
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Have a business enquiry or need assistance? We&apos;d be happy to hear from you.
          </p>
        </div>

        {/* Purpose tags */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {CONTACT_PURPOSES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#aaaacc",
              }}
            >
              <span style={{ color: "#6366f1" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {/* Email */}
          <a
            href="mailto:sidalgs@gmail.com"
            className="group block rounded-2xl p-6 transition-all duration-200"
            style={{
              background: "rgba(14,14,30,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(14,14,30,0.8)";
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
              }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color: "#555577" }}>
              Email
            </p>
            <p className="text-base font-medium text-white group-hover:text-indigo-300 transition-colors duration-200">
              sidalgs@gmail.com
            </p>
          </a>

          {/* Phone */}
          <a
            href="tel:+919336613514"
            className="group block rounded-2xl p-6 transition-all duration-200"
            style={{
              background: "rgba(14,14,30,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(14,14,30,0.8)";
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
              }}
            >
              <Phone className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color: "#555577" }}>
              Phone
            </p>
            <p className="text-base font-medium text-white group-hover:text-indigo-300 transition-colors duration-200">
              +91 9336613514
            </p>
          </a>
        </div>

        {/* Response note */}
        <div
          className="rounded-2xl px-6 py-5 text-center"
          style={{
            background: "rgba(99,102,241,0.05)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#8888aa" }}>
            We typically respond to business enquiries and support requests{" "}
            <span style={{ color: "#a5b4fc" }}>as soon as possible</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
