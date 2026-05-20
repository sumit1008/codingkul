import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return errorResponse("Invalid credentials", 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = await signToken({
      id:    admin._id.toString(),
      email: admin.email,
      role:  admin.role,
    });

    const res = successResponse({ admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } }, "Login successful");

    (res as Response).headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("Internal server error", 500);
  }
}
