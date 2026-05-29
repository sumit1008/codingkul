import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Lecture } from "@/models/Lecture";
import { lectureSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string; lectureId: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id, lectureId } = await params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(lectureId))
      return errorResponse("Invalid ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = lectureSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    const update: Record<string, unknown> = { ...data };
    if (data.unlockAt) update.unlockAt = new Date(data.unlockAt);
    else if (data.unlockAt === "") update.unlockAt = undefined;

    const lecture = await Lecture.findOneAndUpdate(
      { _id: lectureId, batchId: id },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!lecture) return errorResponse("Lecture not found", 404);
    return successResponse(lecture, "Lecture updated");
  } catch {
    return errorResponse("Failed to update lecture", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id, lectureId } = await params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(lectureId))
      return errorResponse("Invalid ID", 400);

    await connectDB();
    const lecture = await Lecture.findOneAndDelete({ _id: lectureId, batchId: id });
    if (!lecture) return errorResponse("Lecture not found", 404);
    return successResponse(null, "Lecture deleted");
  } catch {
    return errorResponse("Failed to delete lecture", 500);
  }
}
