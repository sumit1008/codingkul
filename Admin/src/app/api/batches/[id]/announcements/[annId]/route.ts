import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { errorResponse, successResponse } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string; annId: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id, annId } = await params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(annId))
      return errorResponse("Invalid ID", 400);

    await connectDB();
    const batch = await Batch.findByIdAndUpdate(
      id,
      { $pull: { announcements: { _id: new mongoose.Types.ObjectId(annId) } } },
      { new: true }
    ).lean();

    if (!batch) return errorResponse("Batch not found", 404);
    return successResponse(null, "Announcement deleted");
  } catch {
    return errorResponse("Failed to delete announcement", 500);
  }
}
