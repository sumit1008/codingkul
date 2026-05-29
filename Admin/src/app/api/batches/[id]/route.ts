import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Batch, type IBatch } from "@/models/Batch";
import { Lecture } from "@/models/Lecture";
import { Homework } from "@/models/Homework";
import { batchSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

function validateId(id: string) {
  return mongoose.isValidObjectId(id) ? null : "Invalid batch ID";
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const err = validateId(id);
    if (err) return errorResponse(err, 400);

    await connectDB();
    const [batch, lectureCount, hwCount] = await Promise.all([
      Batch.findById(id).lean() as Promise<IBatch | null>,
      Lecture.countDocuments({ batchId: id }),
      Homework.countDocuments({ batchId: id }),
    ]);

    if (!batch) return errorResponse("Batch not found", 404);

    return successResponse({ ...batch, lectureCount, hwCount, studentCount: (batch.enrolledStudents as mongoose.Types.ObjectId[]).length });
  } catch (err) {
    console.error("[GET /api/batches/[id]]", err);
    return errorResponse("Failed to fetch batch", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const err = validateId(id);
    if (err) return errorResponse(err, 400);

    await connectDB();
    const body   = await req.json();
    const parsed = batchSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const data = parsed.data;
    const update: Record<string, unknown> = { ...data };

    if (data.slug) {
      const slugConflict = await Batch.findOne({ slug: data.slug, _id: { $ne: id } });
      if (slugConflict) return errorResponse("Slug already taken", 409);
    }

    if (data.title && !data.slug) {
      update.slug = slugify(data.title);
    }

    if (data.startDate) update.startDate = new Date(data.startDate as string);
    if (data.endDate)   update.endDate   = new Date(data.endDate as string);

    const batch = await Batch.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
    if (!batch) return errorResponse("Batch not found", 404);

    return successResponse(batch, "Batch updated");
  } catch {
    return errorResponse("Failed to update batch", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const err = validateId(id);
    if (err) return errorResponse(err, 400);

    await connectDB();
    const batch = await Batch.findByIdAndDelete(id).lean();
    if (!batch) return errorResponse("Batch not found", 404);

    const batchOid = new mongoose.Types.ObjectId(id);
    const hwIds = await Homework.find({ batchId: id }).distinct("_id");

    await Promise.all([
      Lecture.deleteMany({ batchId: id }),
      Homework.deleteMany({ batchId: id }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoose.connection.collection("users").updateMany(
        { batches: batchOid },
        { $pull: { batches: batchOid, batchProgress: { batchId: batchOid } } } as any
      ),
      hwIds.length > 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? mongoose.connection.collection("users").updateMany(
            { "homeworkProgress.homeworkId": { $in: hwIds } },
            { $pull: { homeworkProgress: { homeworkId: { $in: hwIds } } } } as any
          )
        : Promise.resolve(),
    ]);

    return successResponse(null, "Batch and all related data deleted");
  } catch {
    return errorResponse("Failed to delete batch", 500);
  }
}
