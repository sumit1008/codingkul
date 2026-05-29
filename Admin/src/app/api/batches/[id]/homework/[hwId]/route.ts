import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Homework } from "@/models/Homework";
import { homeworkSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string; hwId: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id, hwId } = await params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(hwId))
      return errorResponse("Invalid ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = homeworkSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    const update: Record<string, unknown> = { ...data };
    if (data.dueDate) update.dueDate = new Date(data.dueDate);

    const hw = await Homework.findOneAndUpdate(
      { _id: hwId, batchId: id },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!hw) return errorResponse("Homework not found", 404);
    return successResponse(hw, "Homework updated");
  } catch {
    return errorResponse("Failed to update homework", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id, hwId } = await params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(hwId))
      return errorResponse("Invalid ID", 400);

    await connectDB();
    const hw = await Homework.findOneAndDelete({ _id: hwId, batchId: id });
    if (!hw) return errorResponse("Homework not found", 404);
    return successResponse(null, "Homework deleted");
  } catch {
    return errorResponse("Failed to delete homework", 500);
  }
}
