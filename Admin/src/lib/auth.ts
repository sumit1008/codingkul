import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "ck_admin_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-production"
);
const EXPIRY = "7d";

export interface AdminJwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function signToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as AdminJwtPayload;
}

export async function getTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value;
}

export async function getCurrentAdmin(): Promise<AdminJwtPayload | null> {
  try {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export { COOKIE_NAME, EXPIRY };
