"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, AtSign, Loader2, Code2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthLeftPanel from "@/components/auth/left-panel";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.02-.68z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND = API.replace(/\/api$/, "");

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#f59e0b" };
  if (score <= 3) return { score: 3, label: "Good", color: "#6366f1" };
  return { score: 4, label: "Strong", color: "#10b981" };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, user, isLoading } = useAuth();
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    if (!isLoading && user) router.push("/dashboard");
  }, [user, isLoading, router]);

  const handleGoogleSignup = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  const set = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const onUsernameChange = (val: string) => {
    set("username", val);
    setUsernameStatus("idle");
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    if (val.length >= 3) {
      setUsernameStatus("checking");
      usernameTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`${API}/auth/check-username?username=${encodeURIComponent(val)}`);
          const data = await res.json();
          setUsernameStatus(data.available ? "available" : "taken");
        } catch {
          setUsernameStatus("idle");
        }
      }, 700);
    }
  };

  const pwStrength = form.password ? getPasswordStrength(form.password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.username || !form.email || !form.password)
      return setError("Please fill all required fields");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (!agreed) return setError("Please accept the terms to continue");
    if (usernameStatus === "taken") return setError("Username is already taken");
    setLoading(true);
    const result = await signup(form);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Signup failed. Please try again.");
    }
  };

  const inputStyle = (field: string) => ({
    background: "rgba(255,255,255,0.04)",
    border: focus === field ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.09)",
    boxShadow: focus === field ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
    color: "#e8e8f0",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
  });

  return (
    <div className="flex min-h-screen" style={{ background: "#050510" }}>
      <div className="hidden lg:block lg:w-[52%]">
        <AuthLeftPanel />
      </div>

      <div className="w-full lg:w-[48%] flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Codingkul</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              Create account
            </h2>
            <p style={{ color: "#8888aa" }}>Start your journey to placement-ready in minutes.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: focus === "name" ? "#6366f1" : "#8888aa" }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  onFocus={() => setFocus("name")}
                  onBlur={() => setFocus(null)}
                  placeholder="Siddharth Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={inputStyle("name")}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: focus === "username" ? "#6366f1" : "#8888aa" }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  onFocus={() => setFocus("username")}
                  onBlur={() => setFocus(null)}
                  placeholder="siddharth_s"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={{
                    ...inputStyle("username"),
                    border:
                      usernameStatus === "taken"
                        ? "1px solid rgba(239,68,68,0.6)"
                        : usernameStatus === "available"
                        ? "1px solid rgba(16,185,129,0.6)"
                        : inputStyle("username").border,
                  }}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#8888aa" }} />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {usernameStatus === "taken" && (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              {usernameStatus === "available" && (
                <p className="text-[10px] mt-1 text-emerald-400">Username is available</p>
              )}
              {usernameStatus === "taken" && (
                <p className="text-[10px] mt-1 text-red-400">Username is already taken</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: focus === "email" ? "#6366f1" : "#8888aa" }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  onFocus={() => setFocus("email")}
                  onBlur={() => setFocus(null)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={inputStyle("email")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: focus === "password" ? "#6366f1" : "#8888aa" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  onFocus={() => setFocus("password")}
                  onBlur={() => setFocus(null)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={inputStyle("password")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:text-white transition-colors" style={{ color: "#8888aa" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {pwStrength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: s <= pwStrength.score ? pwStrength.color : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px]" style={{ color: pwStrength.color }}>
                    {pwStrength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: focus === "confirm" ? "#6366f1" : "#8888aa" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  onFocus={() => setFocus("confirm")}
                  onBlur={() => setFocus(null)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={{
                    ...inputStyle("confirm"),
                    border:
                      form.confirm && form.password !== form.confirm
                        ? "1px solid rgba(239,68,68,0.6)"
                        : form.confirm && form.password === form.confirm
                        ? "1px solid rgba(16,185,129,0.6)"
                        : inputStyle("confirm").border,
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:text-white transition-colors" style={{ color: "#8888aa" }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <div
                onClick={() => setAgreed(!agreed)}
                className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer"
                style={{
                  background: agreed ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255,255,255,0.06)",
                  border: agreed ? "none" : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {agreed && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: "#8888aa" }}>
                I agree to the{" "}
                <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#555577" }}>or sign up with</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#e8e8f0" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(66,133,244,0.5)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(66,133,244,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              disabled
              title="GitHub signup coming soon"
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium opacity-40 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#e8e8f0" }}
            >
              <GitHubIcon />
              GitHub
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "#8888aa" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
