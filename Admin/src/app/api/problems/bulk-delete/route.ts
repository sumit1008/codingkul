import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Problem } from "@/models/Problem";
import { Sheet } from "@/models/Sheet";
import { errorResponse, successResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json() as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse("No IDs provided", 400);
    }

    await connectDB();

    // gather sheet IDs for counter updates
    const toDelete = await Problem.find({ _id: { $in: ids } }).select("sheetId").lean();
    const sheetCounts: Record<string, number> = {};
    toDelete.forEach((p) => {
      const sid = p.sheetId?.toString();
      if (sid) sheetCounts[sid] = (sheetCounts[sid] ?? 0) + 1;
    });

    await Problem.deleteMany({ _id: { $in: ids } });

    await Promise.all(
      Object.entries(sheetCounts).map(([sid, count]) =>
        Sheet.findByIdAndUpdate(sid, { $inc: { totalProblems: -count } })
      )
    );

    return successResponse({ deleted: ids.length }, `Deleted ${ids.length} problems`);
  } catch {
    return errorResponse("Bulk delete failed", 500);
  }
}
