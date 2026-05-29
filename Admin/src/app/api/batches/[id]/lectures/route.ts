import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Lecture } from "@/models/Lecture";
import { lectureSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const lectures = await Lecture.find({ batchId: id }).sort({ order: 1, createdAt: 1 }).lean();
    return successResponse(lectures);
  } catch (err) {
    console.error("[GET /api/batches/[id]/lectures]", err);
    return errorResponse("Failed to fetch lectures", 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = lectureSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;

    const lecture = await Lecture.create({
      title:                data.title,
      batchId:              new mongoose.Types.ObjectId(id),
      module:               data.module,
      description:          data.description,
      youtubeVideoId:       data.youtubeVideoId,
      duration:             data.duration,
      order:                data.order,
      unlockAt:             data.unlockAt ? new Date(data.unlockAt) : undefined,
      isLiveClassRecording: data.isLiveClassRecording,
    });

    return successResponse(lecture.toObject(), "Lecture created");
  } catch (err) {
    console.error("[POST /api/batches/[id]/lectures]", err);
    return errorResponse("Failed to create lecture", 500);
  }
}
