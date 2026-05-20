import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = Response.json({ success: true, message: "Logged out" });
  res.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
  return res;
}
