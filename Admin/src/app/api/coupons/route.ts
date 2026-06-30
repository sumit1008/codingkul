import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon, type ICoupon } from "@/models/Coupon";
import { Admin } from "@/models/Admin";
import { getCurrentAdmin } from "@/lib/auth";
import { couponSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";
import { getCouponStatus } from "@/lib/couponStatus";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, Number(searchParams.get("page")   ?? 1));
    const limit  = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
    const q      = searchParams.get("q")      ?? "";
    const status = searchParams.get("status") ?? "";
    const course = searchParams.get("course") ?? "";

    const filter: Record<string, unknown> = { isDeleted: false };
    if (q)      filter.code = { $regex: q, $options: "i" };
    if (course) filter.applicableCourses = course;

    const now = new Date();
    if (status === "active")   { filter.isDisabled = false; filter.expiresAt = { $gt: now }; filter.$expr = { $lt: ["$usageCount", "$maxUsageCount"] }; }
    if (status === "disabled") { filter.isDisabled = true; }
    if (status === "expired") {
      filter.isDisabled = false;
      filter.$or = [{ expiresAt: { $lte: now } }, { $expr: { $gte: ["$usageCount", "$maxUsageCount"] } }];
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean<ICoupon[]>(),
      Coupon.countDocuments(filter),
    ]);

    const enriched = coupons.map((c) => ({ ...c, status: getCouponStatus(c) }));

    return successResponse({ coupons: enriched, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[GET /api/coupons]", err);
    return errorResponse("Failed to fetch coupons", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return errorResponse("Unauthorized", 401);

    await connectDB();
    const body   = await req.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    const code = data.code.trim().toUpperCase();

    const exists = await Coupon.findOne({ code });
    if (exists) return errorResponse("A coupon with this code already exists", 409);

    const adminDoc = await Admin.findById(admin.id).select("name email");

    const coupon = await Coupon.create({
      code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      applicableCourses: data.applicableCourses,
      validityDays: data.validityDays,
      maxUsageCount: data.maxUsageCount,
      isDisabled: data.isDisabled,
      createdBy: admin.id,
      createdByName: adminDoc?.name ?? admin.email,
      createdByEmail: admin.email,
    });

    return successResponse(coupon.toObject(), "Coupon created");
  } catch (err: unknown) {
    console.error("[POST /api/coupons]", err);
    if ((err as { code?: number }).code === 11000) return errorResponse("A coupon with this code already exists", 409);
    return errorResponse("Failed to create coupon", 500);
  }
}
