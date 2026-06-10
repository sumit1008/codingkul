"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type CourseTier = "NONE" | "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";

export const TIER_LABELS: Record<CourseTier, string> = {
  NONE: "Free User",
  FOUNDATION: "Foundation Student",
  ACCELERATOR: "Accelerator Student",
  PLACEMENT: "Placement Student",
};

export interface PurchasedProduct {
  productId: string;
  productType: string;
  purchasedAt: string;
  paymentId: string;
  orderId: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  rank: number;
  rating: number;
  solved: number;
  title: string;
  role: string;
  courseTier: CourseTier;
  purchasedCourses: string[];
  purchasedProducts: PurchasedProduct[];
  enrolledBatches: number;
}

/** True if user has any paid access (purchased product, tier, or batch) */
export function hasPaidAccess(user: User | null): boolean {
  if (!user) return false;
  return (
    user.purchasedProducts.length > 0 ||
    user.courseTier !== "NONE" ||
    user.purchasedCourses.length > 0 ||
    user.enrolledBatches > 0
  );
}

/** True if user has purchased a specific product */
export function hasPurchasedProduct(user: User | null, productId: string): boolean {
  if (!user) return false;
  return user.purchasedProducts.some((p) => p.productId === productId);
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(u: any): User {
  const level = u.level ?? 1;
  return {
    id: u._id || u.id || "",
    name: u.fullName || u.name || "",
    username: u.username || "",
    email: u.email || "",
    avatar: (() => {
      const raw = u.avatar || "";
      const initials = (u.fullName || u.name || "U").slice(0, 2).toUpperCase();
      return raw.startsWith("http") ? initials : (raw || initials);
    })(),
    level,
    xp: u.xp ?? 0,
    xpMax: level * 1000,
    streak: u.streak ?? 0,
    rank: u.rank ?? 0,
    rating: u.rating ?? u.academyRating ?? 1200,
    solved: u.solved ?? u.problemsSolved ?? 0,
    title: u.rankTitle ?? u.academyRankTitle ?? "Pupil",
    role: u.role || "student",
    courseTier: u.courseTier || "NONE",
    purchasedCourses: u.purchasedCourses || [],
    purchasedProducts: u.purchasedProducts || [],
    enrolledBatches: u.enrolledBatches ?? 0,
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session via httpOnly cookie on mount
  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.user) setUser(mapUser(data.user)); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Invalid credentials" };
      sessionStorage.setItem("ck_new_login", "true");
      setUser(mapUser(data.user));
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (data: { name: string; username: string; email: string; password: string }) => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.message || "Signup failed" };
      sessionStorage.setItem("ck_new_login", "true");
      setUser(mapUser(json.user));
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: "include" });
      const data = res.ok ? await res.json() : null;
      if (data?.user) setUser(mapUser(data.user));
    } catch {
      // silently ignore — user state stays unchanged
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Tier hierarchy helpers ────────────────────────────────────────────────────

export const PRODUCT_TIER_RANK: Record<string, number> = {
  foundation: 1,
  accelerator: 2,
  placement: 3,
};

export const PRODUCT_TIER_LABELS: Record<string, string> = {
  foundation: "Foundation Program",
  accelerator: "Accelerator Program",
  placement: "Placement Mastery",
};

/** Returns the slug of the highest purchased tier, or null if nothing is purchased */
export function getHighestPurchasedTier(user: User | null): string | null {
  if (!user?.purchasedProducts?.length) return null;
  let maxRank = 0;
  let highest: string | null = null;
  for (const p of user.purchasedProducts) {
    const rank = PRODUCT_TIER_RANK[p.productId] ?? 0;
    if (rank > maxRank) { maxRank = rank; highest = p.productId; }
  }
  return highest;
}

/** Returns the numeric rank of the highest purchased tier (0 = no purchase) */
export function getHighestPurchasedRank(user: User | null): number {
  const tier = getHighestPurchasedTier(user);
  return tier ? (PRODUCT_TIER_RANK[tier] ?? 0) : 0;
}
