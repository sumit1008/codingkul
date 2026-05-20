import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Contest } from "@/models/Contest";
import { ContestResult } from "@/models/ContestResult";
import { errorResponse, successResponse } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const contest = await Contest.findById(id).lean();
    if (!contest) return errorResponse("Contest not found", 404);

    const results = await ContestResult.find({ contestId: id })
      .populate("userId", "fullName username email")
      .sort({ globalRank: 1 })
      .limit(200)
      .lean();

    return successResponse({ contest, results, total: results.length });
  } catch {
    return errorResponse("Failed to fetch participants", 500);
  }
}
