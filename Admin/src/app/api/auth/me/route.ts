import { getCurrentAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET() {
  try {
    const payload = await getCurrentAdmin();
    if (!payload) return errorResponse("Unauthorized", 401);

    await connectDB();
    const admin = await Admin.findById(payload.id).select("-password");
    if (!admin) return errorResponse("Admin not found", 404);

    return successResponse({ id: admin._id, email: admin.email, name: admin.name, role: admin.role });
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
