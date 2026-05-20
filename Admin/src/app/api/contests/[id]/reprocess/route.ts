import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Contest } from "@/models/Contest";
import { errorResponse, successResponse } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const contest = await Contest.findById(id);
    if (!contest) return errorResponse("Contest not found", 404);

    if (contest.status !== "completed") {
      return errorResponse("Contest must be completed before reprocessing results", 400);
    }

    // Reset the processedResults flag so the backend cron job re-picks it up
    await Contest.findByIdAndUpdate(id, { $set: { processedResults: false } });

    return successResponse(
      { contestId: id },
      "Contest flagged for reprocessing — results will update on next cron run"
    );
  } catch {
    return errorResponse("Failed to flag contest for reprocessing", 500);
  }
}
