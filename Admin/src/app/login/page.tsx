"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Code2, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/validations/schemas";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Login failed");
        return;
      }

      setUser(json.data.admin);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 0 32px rgba(99,102,241,0.4)" }}
          >
            <Code2 className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">AlgoShashtra Admin</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage your DSA content</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
        >
          {/* Security badge */}
          <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <ShieldCheck className="w-4 h-4 text-primary-light flex-shrink-0" />
            <span className="text-xs text-primary-light">Admin access only. All sessions are monitored.</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="input pl-10"
                />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-11 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                "Sign in to Admin Panel"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-faint mt-6">
          AlgoShashtra CMS · Restricted access
        </p>
      </motion.div>
    </div>
  );
}
