import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Contest } from "@/models/Contest";
import { fetchCFContestInfo, cfContestPhaseToStatus } from "@/lib/codeforcesApi";
import { errorResponse, successResponse } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Contest not found", 404);

    const contest = await Contest.findById(id);
    if (!contest) return errorResponse("Contest not found", 404);

    // Try fetching live status from Codeforces
    const cfContest = await fetchCFContestInfo(contest.codeforcesContestId);

    let newStatus = contest.status;

    if (cfContest) {
      newStatus = cfContestPhaseToStatus(cfContest.phase);
    } else {
      // Fall back to time-based determination
      const now = new Date();
      if (now < contest.startTime) {
        newStatus = "upcoming";
      } else if (now >= contest.startTime && now < contest.endTime) {
        newStatus = "running";
      } else {
        newStatus = "completed";
      }
    }

    const updated = await Contest.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );

    return successResponse(
      { contest: updated, cfContestFound: !!cfContest },
      `Status synced to "${newStatus}"`
    );
  } catch {
    return errorResponse("Failed to sync contest", 500);
  }
}
