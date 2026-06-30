import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon, type ICoupon } from "@/models/Coupon";
import { CouponRedemption, type ICouponRedemption } from "@/models/CouponRedemption";
import { getCurrentAdmin } from "@/lib/auth";
import { couponUpdateSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";
import { getCouponStatus, expiryReason } from "@/lib/couponStatus";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();

    const coupon = await Coupon.findOne({ _id: id, isDeleted: false }).lean<ICoupon>();
    if (!coupon) return errorResponse("Coupon not found", 404);

    const redemptions = await CouponRedemption.find({ couponId: id })
      .sort({ createdAt: -1 })
      .lean<ICouponRedemption[]>();

    const stats = redemptions.reduce(
      (acc, r) => {
        acc.totalPurchases += 1;
        acc.totalRevenue += r.finalAmount;
        acc.totalDiscountGiven += r.discountAmount;
        return acc;
      },
      { totalPurchases: 0, totalRevenue: 0, totalDiscountGiven: 0 }
    );

    return successResponse({
      coupon: {
        ...coupon,
        status: getCouponStatus(coupon),
        expiryReason: expiryReason(coupon),
      },
      stats: {
        ...stats,
        remainingUses: Math.max(0, coupon.maxUsageCount - coupon.usageCount),
      },
      purchaseHistory: redemptions,
    });
  } catch (err) {
    console.error("[GET /api/coupons/[id]]", err);
    return errorResponse("Failed to fetch coupon", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const coupon = await Coupon.findOne({ _id: id, isDeleted: false });
    if (!coupon) return errorResponse("Coupon not found", 404);

    if (body.action === "enable")  { coupon.isDisabled = false; await coupon.save(); return successResponse(coupon.toObject(), "Coupon enabled"); }
    if (body.action === "disable") { coupon.isDisabled = true;  await coupon.save(); return successResponse(coupon.toObject(), "Coupon disabled"); }

    const parsed = couponUpdateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    if (data.code) {
      const code = data.code.trim().toUpperCase();
      const exists = await Coupon.findOne({ code, _id: { $ne: id } });
      if (exists) return errorResponse("A coupon with this code already exists", 409);
      coupon.code = code;
    }
    if (data.description !== undefined)       coupon.description = data.description;
    if (data.discountType !== undefined)       coupon.discountType = data.discountType;
    if (data.discountValue !== undefined)      coupon.discountValue = data.discountValue;
    if (data.applicableCourses !== undefined)  coupon.applicableCourses = data.applicableCourses;
    if (data.validityDays !== undefined)       coupon.validityDays = data.validityDays;
    if (data.maxUsageCount !== undefined)      coupon.maxUsageCount = data.maxUsageCount;
    if (data.isDisabled !== undefined)         coupon.isDisabled = data.isDisabled;

    await coupon.save();
    return successResponse(coupon.toObject(), "Coupon updated");
  } catch (err: unknown) {
    console.error("[PATCH /api/coupons/[id]]", err);
    if ((err as { code?: number }).code === 11000) return errorResponse("A coupon with this code already exists", 409);
    return errorResponse("Failed to update coupon", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    await connectDB();

    const coupon = await Coupon.findOne({ _id: id, isDeleted: false });
    if (!coupon) return errorResponse("Coupon not found", 404);

    coupon.isDeleted = true;
    coupon.deletedAt = new Date();
    await coupon.save();

    return successResponse(null, "Coupon deleted");
  } catch (err) {
    console.error("[DELETE /api/coupons/[id]]", err);
    return errorResponse("Failed to delete coupon", 500);
  }
}
