import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Contest } from "@/models/Contest";
import { contestSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, Number(searchParams.get("page")   ?? 1));
    const limit  = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const q      = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "";

    const filter: Record<string, unknown> = {};
    if (q)      filter.title  = { $regex: q, $options: "i" };
    if (status) filter.status = status;

    const [contests, total] = await Promise.all([
      Contest.find(filter).sort({ startTime: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Contest.countDocuments(filter),
    ]);

    return successResponse({
      contests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return errorResponse("Failed to fetch contests", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body   = await req.json();
    const parsed = contestSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;

    const exists = await Contest.findOne({ codeforcesContestId: data.codeforcesContestId });
    if (exists) return errorResponse(`Contest with CF ID ${data.codeforcesContestId} already exists`, 409);

    const slug = data.slug || slugify(data.title);
    const slugExists = await Contest.findOne({ slug });
    if (slugExists) return errorResponse("A contest with this slug already exists", 409);

    const topics = data.topics
      ? data.topics.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const contest = await Contest.create({
      title:                 data.title,
      slug,
      codeforcesContestId:   data.codeforcesContestId,
      codeforcesContestLink: data.codeforcesContestLink,
      startTime:             new Date(data.startTime),
      endTime:               new Date(data.endTime),
      duration:              data.duration,
      difficulty:            data.difficulty,
      topics,
      xpReward:              data.xpReward,
      status:                data.status,
    });

    return successResponse(contest.toObject(), "Contest created");
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) return errorResponse("Duplicate contest ID or slug", 409);
    return errorResponse("Failed to create contest", 500);
  }
}
