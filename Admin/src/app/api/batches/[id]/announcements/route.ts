import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Batch, type IBatch } from "@/models/Batch";
import { errorResponse, successResponse } from "@/lib/utils";
import { z } from "zod";

const annSchema = z.object({
  title:    z.string().min(2).max(200),
  content:  z.string().min(1).max(5000),
  isPinned: z.boolean().default(false),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return errorResponse("Invalid batch ID", 400);

    await connectDB();
    const body   = await req.json();
    const parsed = annSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const batch = await Batch.findByIdAndUpdate(
      id,
      { $push: { announcements: { $each: [{ ...parsed.data, createdAt: new Date() }], $position: 0 } } },
      { new: true }
    ).lean() as IBatch | null;

    if (!batch) return errorResponse("Batch not found", 404);
    return successResponse((batch.announcements as IBatch["announcements"])[0], "Announcement added");
  } catch {
    return errorResponse("Failed to add announcement", 500);
  }
}
