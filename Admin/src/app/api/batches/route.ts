import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { Lecture } from "@/models/Lecture";
import { Homework } from "@/models/Homework";
import { batchSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const q     = searchParams.get("q") ?? "";

    const filter: Record<string, unknown> = {};
    if (q) filter.title = { $regex: q, $options: "i" };

    const [batches, total] = await Promise.all([
      Batch.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Batch.countDocuments(filter),
    ]);

    const batchIds = batches.map((b) => b._id);
    const [lectureCounts, hwCounts] = await Promise.all([
      Lecture.aggregate([
        { $match: { batchId: { $in: batchIds } } },
        { $group: { _id: "$batchId", count: { $sum: 1 } } },
      ]),
      Homework.aggregate([
        { $match: { batchId: { $in: batchIds } } },
        { $group: { _id: "$batchId", count: { $sum: 1 } } },
      ]),
    ]);

    const lcMap = Object.fromEntries(lectureCounts.map((x) => [String(x._id), x.count]));
    const hwMap = Object.fromEntries(hwCounts.map((x) => [String(x._id), x.count]));

    const enriched = batches.map((b) => ({
      ...b,
      lectureCount: lcMap[String(b._id)] ?? 0,
      hwCount:      hwMap[String(b._id)] ?? 0,
      studentCount: b.enrolledStudents.length,
    }));

    return successResponse({
      batches: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/batches]", err);
    return errorResponse("Failed to fetch batches", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body   = await req.json();
    const parsed = batchSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    const slug = data.slug || slugify(data.title);

    const exists = await Batch.findOne({ slug });
    if (exists) return errorResponse("A batch with this slug already exists", 409);

    const batch = await Batch.create({
      title:          data.title,
      slug,
      description:    data.description,
      courseId:       data.courseId || undefined,
      instructorName: data.instructorName,
      meetLink:       data.meetLink,
      bannerImage:    data.bannerImage,
      startDate:      new Date(data.startDate),
      endDate:        new Date(data.endDate),
      isActive:       data.isActive,
    });

    return successResponse(batch.toObject(), "Batch created");
  } catch (err: unknown) {
    console.error("[POST /api/batches]", err);
    if ((err as { code?: number }).code === 11000) return errorResponse("Slug already exists", 409);
    return errorResponse("Failed to create batch", 500);
  }
}
