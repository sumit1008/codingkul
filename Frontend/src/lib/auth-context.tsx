"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  name: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  rank: number;
  rating: number;
  solved: number;
  avatar: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const MOCK_USER: User = {
  name: "Siddharth Sharma",
  username: "siddharth_s",
  email: "siddharth@example.com",
  level: 12,
  xp: 3240,
  xpMax: 5000,
  streak: 28,
  rank: 142,
  rating: 1847,
  solved: 487,
  avatar: "SS",
  title: "Algorithm Apprentice",
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ck_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1100));
    if (!email || !password) return { success: false, error: "Please enter your email and password." };
    if (email !== "demo@dsaacademy.dev" || password !== "12345678") {
      return { success: false, error: "Invalid credentials. Use the demo account below." };
    }
    localStorage.setItem("ck_user", JSON.stringify(MOCK_USER));
    sessionStorage.setItem("ck_new_login", "true");
    setUser(MOCK_USER);
    return { success: true };
  };

  const signup = async (data: { name: string; username: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 1400));
    const u = {
      ...MOCK_USER,
      name: data.name,
      username: data.username,
      email: data.email,
      avatar: data.name.slice(0, 2).toUpperCase(),
    };
    localStorage.setItem("ck_user", JSON.stringify(u));
    sessionStorage.setItem("ck_new_login", "true");
    setUser(u);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("ck_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
