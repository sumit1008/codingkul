import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Batch, type IBatch } from "@/models/Batch";
import { errorResponse, successResponse } from "@/lib/utils";
import { z } from "zod";

const enrollSchema  = z.object({ studentIds: z.array(z.string()).min(1) });
const removeSchema  = z.object({ studentId: z.string().min(1) });

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const batch = await Batch.findById(id).select("enrolledStudents").lean() as IBatch | null;
    if (!batch) return errorResponse("Batch not found", 404);

    return successResponse({ studentIds: batch.enrolledStudents, count: (batch.enrolledStudents as mongoose.Types.ObjectId[]).length });
  } catch {
    return errorResponse("Failed to fetch students", 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = enrollSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const objectIds = parsed.data.studentIds
      .filter((s) => mongoose.isValidObjectId(s))
      .map((s) => new mongoose.Types.ObjectId(s));

    const batch = await Batch.findByIdAndUpdate(
      id,
      { $addToSet: { enrolledStudents: { $each: objectIds } } },
      { new: true }
    ).lean() as IBatch | null;

    if (!batch) return errorResponse("Batch not found", 404);
    return successResponse({ count: (batch.enrolledStudents as mongoose.Types.ObjectId[]).length }, "Students enrolled");
  } catch {
    return errorResponse("Failed to enroll students", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = removeSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const batch = await Batch.findByIdAndUpdate(
      id,
      { $pull: { enrolledStudents: new mongoose.Types.ObjectId(parsed.data.studentId) } },
      { new: true }
    ).lean() as IBatch | null;

    if (!batch) return errorResponse("Batch not found", 404);
    return successResponse({ count: (batch.enrolledStudents as mongoose.Types.ObjectId[]).length }, "Student removed");
  } catch {
    return errorResponse("Failed to remove student", 500);
  }
}
