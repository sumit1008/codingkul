"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Code2 } from "lucide-react";
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

const BACKEND =
  typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) router.push("/dashboard");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      setError("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = `${BACKEND}/api/auth/google`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login failed. Please try again.");
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

      <div className="w-full lg:w-[48%] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
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
              Welcome back
            </h2>
            <p style={{ color: "#8888aa" }}>Continue your DSA journey. Enter your credentials.</p>
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
            {/* Email */}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8888aa" }}>
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: focus === "email" ? "#6366f1" : "#8888aa" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: focus === "password" ? "#6366f1" : "#8888aa" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocus("password")}
                  onBlur={() => setFocus(null)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm placeholder-[#555577]"
                  style={inputStyle("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: "#8888aa" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRemember(!remember)}
                  className="w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    background: remember
                      ? "linear-gradient(135deg, #6366f1, #a855f7)"
                      : "rgba(255,255,255,0.06)",
                    border: remember ? "none" : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {remember && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-xs" style={{ color: "#8888aa" }}>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: loading
                  ? "rgba(99,102,241,0.5)"
                  : "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#555577" }}>
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              title="GitHub login coming soon"
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium opacity-40 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#e8e8f0" }}
            >
              <GitHubIcon />
              GitHub
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "#8888aa" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
