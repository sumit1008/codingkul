import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Problem } from "@/models/Problem";
import { Sheet } from "@/models/Sheet";
import { problemSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page       = Math.max(1, Number(searchParams.get("page")   ?? 1));
    const limit      = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
    const q          = searchParams.get("q")          ?? "";
    const difficulty = searchParams.get("difficulty") ?? "";
    const topic      = searchParams.get("topic")      ?? "";
    const platform   = searchParams.get("platform")   ?? "";
    const sheetId    = searchParams.get("sheetId")    ?? "";

    const filter: Record<string, unknown> = {};
    if (q)          filter.$or = [{ title: { $regex: q, $options: "i" } }, { topic: { $regex: q, $options: "i" } }];
    if (difficulty) filter.difficulty = difficulty;
    if (topic)      filter.topic = topic;
    if (platform)   filter.platform = platform;
    if (sheetId)    filter.sheetId = sheetId;

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .populate("sheetId", "title slug")
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Problem.countDocuments(filter),
    ]);

    const enriched = problems.map((p) => ({
      ...p,
      sheetTitle: (p.sheetId as unknown as { title?: string } | null)?.title ?? null,
      sheetId:    (p.sheetId as unknown as { _id?: string } | null)?._id?.toString() ?? null,
    }));

    return successResponse({ problems: enriched, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return errorResponse("Failed to fetch problems", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body   = await req.json();
    const parsed = problemSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = { ...parsed.data };
    if (!data.slug) data.slug = slugify(data.title);

    const tags      = data.tags      ? String(data.tags).split(",").map((t) => t.trim()).filter(Boolean)      : [];
    const companies = data.companies ? String(data.companies).split(",").map((c) => c.trim()).filter(Boolean) : [];

    const exists = await Problem.findOne({ slug: data.slug });
    if (exists) return errorResponse("A problem with this slug already exists", 409);

    const problem = await Problem.create({ ...data, tags, companies });

    if (data.sheetId) {
      await Sheet.findByIdAndUpdate(data.sheetId, { $inc: { totalProblems: 1 } });
    }

    return successResponse(problem.toObject(), "Problem created");
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) return errorResponse("Slug already exists", 409);
    return errorResponse("Failed to create problem", 500);
  }
}
