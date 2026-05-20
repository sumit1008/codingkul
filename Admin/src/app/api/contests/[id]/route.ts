import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Contest } from "@/models/Contest";
import { ContestResult } from "@/models/ContestResult";
import { contestSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const contest = await Contest.findById(id).lean();
    if (!contest) return errorResponse("Contest not found", 404);

    const participantCount = await ContestResult.countDocuments({ contestId: id });

    return successResponse({ ...contest, participantCount });
  } catch {
    return errorResponse("Failed to fetch contest", 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const body   = await req.json();
    const parsed = contestSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const contest = await Contest.findById(id);
    if (!contest) return errorResponse("Contest not found", 404);

    const data = parsed.data;

    const updatePayload: Record<string, unknown> = {};

    if (data.title) {
      updatePayload.title = data.title;
      if (!data.slug) updatePayload.slug = slugify(data.title);
    }
    if (data.slug) updatePayload.slug = data.slug;
    if (data.codeforcesContestLink) updatePayload.codeforcesContestLink = data.codeforcesContestLink;
    if (data.startTime) updatePayload.startTime = new Date(data.startTime);
    if (data.endTime)   updatePayload.endTime   = new Date(data.endTime);
    if (data.duration)  updatePayload.duration  = data.duration;
    if (data.difficulty) updatePayload.difficulty = data.difficulty;
    if (data.topics !== undefined) {
      updatePayload.topics = data.topics
        ? data.topics.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    }
    if (data.xpReward !== undefined) updatePayload.xpReward = data.xpReward;
    if (data.status) updatePayload.status = data.status;

    const updated = await Contest.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    return successResponse(updated, "Contest updated");
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) return errorResponse("Slug or CF ID already exists", 409);
    return errorResponse("Failed to update contest", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const contest = await Contest.findById(id);
    if (!contest) return errorResponse("Contest not found", 404);

    if (contest.processedResults) {
      return errorResponse("Cannot delete a contest with processed results — update status to archived instead", 400);
    }

    await Contest.findByIdAndDelete(id);
    await ContestResult.deleteMany({ contestId: contest._id });

    return successResponse(null, "Contest deleted");
  } catch {
    return errorResponse("Failed to delete contest", 500);
  }
}
