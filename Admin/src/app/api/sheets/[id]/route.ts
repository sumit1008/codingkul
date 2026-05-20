import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Sheet } from "@/models/Sheet";
import { Problem } from "@/models/Problem";
import { sheetSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const sheet = await Sheet.findById(id).lean();
    if (!sheet) return errorResponse("Sheet not found", 404);
    return successResponse(sheet);
  } catch {
    return errorResponse("Failed to fetch sheet", 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body   = await req.json();
    const parsed = sheetSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const sheet = await Sheet.findByIdAndUpdate(id, { $set: parsed.data }, { new: true, runValidators: true }).lean();
    if (!sheet) return errorResponse("Sheet not found", 404);
    return successResponse(sheet, "Sheet updated");
  } catch {
    return errorResponse("Failed to update sheet", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const sheet = await Sheet.findByIdAndDelete(id);
    if (!sheet) return errorResponse("Sheet not found", 404);

    // unlink problems
    await Problem.updateMany({ sheetId: id }, { $set: { sheetId: null } });

    return successResponse(null, "Sheet deleted");
  } catch {
    return errorResponse("Failed to delete sheet", 500);
  }
}
