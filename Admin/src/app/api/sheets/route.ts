import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Sheet } from "@/models/Sheet";
import { sheetSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const q     = searchParams.get("q") ?? "";

    const filter = q ? { title: { $regex: q, $options: "i" } } : {};

    const [sheets, total] = await Promise.all([
      Sheet.find(filter).sort({ order: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Sheet.countDocuments(filter),
    ]);

    return successResponse({ sheets, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return errorResponse("Failed to fetch sheets", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body   = await req.json();
    const parsed = sheetSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    if (!data.slug) data.slug = slugify(data.title);

    const exists = await Sheet.findOne({ slug: data.slug });
    if (exists) return errorResponse("A sheet with this slug already exists", 409);

    const sheet = await Sheet.create(data);
    return successResponse(sheet.toObject(), "Sheet created");
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) return errorResponse("Slug already exists", 409);
    return errorResponse("Failed to create sheet", 500);
  }
}
