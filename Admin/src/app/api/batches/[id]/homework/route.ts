import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Homework } from "@/models/Homework";
import { homeworkSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const homework = await Homework.find({ batchId: id }).sort({ dueDate: 1 }).lean();
    return successResponse(homework);
  } catch (err) {
    console.error("[GET /api/batches/[id]/homework]", err);
    return errorResponse("Failed to fetch homework", 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = homeworkSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;

    // Guard against invalid lectureId strings (non-empty but invalid ObjectId)
    if (data.lectureId && !mongoose.isValidObjectId(data.lectureId)) {
      return errorResponse("Invalid lecture ID format", 400);
    }

    const hw = await Homework.create({
      title:       data.title,
      description: data.description,
      batchId:     new mongoose.Types.ObjectId(id),
      lectureId:   data.lectureId ? new mongoose.Types.ObjectId(data.lectureId) : undefined,
      dueDate:     new Date(data.dueDate),
      difficulty:  data.difficulty,
      xpReward:    data.xpReward,
      isMandatory: data.isMandatory,
      problems:    [],
    });

    return successResponse(hw.toObject(), "Homework created");
  } catch (err) {
    console.error("[POST /api/batches/[id]/homework]", err);
    return errorResponse("Failed to create homework", 500);
  }
}
