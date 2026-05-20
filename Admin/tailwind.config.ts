import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#05050f",
          card: "#0c0c1e",
          hover: "#111128",
          elevated: "#13132a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
          focus: "rgba(99,102,241,0.5)",
        },
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#a5b4fc",
          dark: "#3730a3",
          glow: "rgba(99,102,241,0.35)",
        },
        accent: {
          DEFAULT: "#a855f7",
          light: "#d8b4fe",
        },
        text: {
          DEFAULT: "#e8e8f4",
          muted: "#8888aa",
          faint: "#555577",
        },
        success: { DEFAULT: "#22c55e", light: "#86efac", bg: "rgba(34,197,94,0.1)" },
        warning: { DEFAULT: "#f59e0b", light: "#fcd34d", bg: "rgba(245,158,11,0.1)" },
        danger: { DEFAULT: "#ef4444", light: "#fca5a5", bg: "rgba(239,68,68,0.1)" },
        easy:   { DEFAULT: "#22c55e", bg: "rgba(34,197,94,0.12)" },
        medium: { DEFAULT: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
        hard:   { DEFAULT: "#ef4444", bg: "rgba(239,68,68,0.12)" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.5)",
        glow: "0 0 30px rgba(99,102,241,0.2)",
        "glow-sm": "0 0 16px rgba(99,102,241,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in": "slideIn 0.25s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideIn: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
