"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      router.push("/login?error=google_failed");
      return;
    }

    fetch("/api/set-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("set-auth failed");
        // Full page reload so AuthProvider remounts and re-fetches /api/auth/me
        // with the new cookie. router.push() keeps AuthProvider alive with
        // stale user=null state, causing AppLayout to redirect back to /login.
        window.location.href = "/dashboard";
      })
      .catch(() => router.push("/login?error=google_failed"));
  }, [params, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#050510" }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(99,102,241,0.4)", borderTopColor: "#6366f1" }}
      />
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
