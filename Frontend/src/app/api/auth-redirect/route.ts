import { NextRequest, NextResponse } from "next/server";

// Server-side handler: receives JWT from Railway OAuth callback, sets cookie,
// and redirects to /dashboard in a single HTTP round-trip.
// Faster than the client-side /callback page (no React hydration, no fetch).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=google_failed", req.url));
  }

  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set("ck_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    domain: isProd ? ".codingkul.in" : undefined,
  });
  return res;
}
