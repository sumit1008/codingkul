import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":   return "text-easy bg-easy-bg";
    case "medium": return "text-medium bg-medium-bg";
    case "hard":   return "text-hard bg-hard-bg";
    default:       return "text-text-muted bg-bg-elevated";
  }
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    leetcode:     "text-[#ffa116] bg-[rgba(255,161,22,0.1)]",
    codeforces:   "text-[#1992d4] bg-[rgba(25,146,212,0.1)]",
    geeksforgeeks:"text-[#2f8d46] bg-[rgba(47,141,70,0.1)]",
    codingninjas: "text-[#f04f23] bg-[rgba(240,79,35,0.1)]",
    atcoder:      "text-[#9b9b9b] bg-[rgba(155,155,155,0.1)]",
  };
  return map[platform.toLowerCase()] ?? "text-text-muted bg-bg-elevated";
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function successResponse(data: unknown, message?: string) {
  return Response.json({ success: true, data, ...(message ? { message } : {}) });
}
