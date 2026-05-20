import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Problem } from "@/models/Problem";
import { Sheet } from "@/models/Sheet";
import { problemSchema } from "@/validations/schemas";
import { errorResponse, successResponse } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const problem = await Problem.findById(id).populate("sheetId", "title slug").lean();
    if (!problem) return errorResponse("Problem not found", 404);
    return successResponse(problem);
  } catch {
    return errorResponse("Failed to fetch problem", 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body   = await req.json();
    const parsed = problemSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const old = await Problem.findById(id);
    if (!old) return errorResponse("Problem not found", 404);

    const data = { ...parsed.data } as Record<string, unknown>;
    if (data.tags)      data.tags      = String(data.tags).split(",").map((t: string) => t.trim()).filter(Boolean);
    if (data.companies) data.companies = String(data.companies).split(",").map((c: string) => c.trim()).filter(Boolean);

    const oldSheetId = old.sheetId?.toString();
    const newSheetId = String(data.sheetId ?? "").trim() || null;

    const updated = await Problem.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!updated) return errorResponse("Problem not found", 404);

    // update totalProblems counters if sheet changed
    if (oldSheetId !== newSheetId) {
      if (oldSheetId) await Sheet.findByIdAndUpdate(oldSheetId, { $inc: { totalProblems: -1 } });
      if (newSheetId) await Sheet.findByIdAndUpdate(newSheetId, { $inc: { totalProblems:  1 } });
    }

    return successResponse(updated, "Problem updated");
  } catch {
    return errorResponse("Failed to update problem", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) return errorResponse("Problem not found", 404);

    if (problem.sheetId) {
      await Sheet.findByIdAndUpdate(problem.sheetId, { $inc: { totalProblems: -1 } });
    }
    return successResponse(null, "Problem deleted");
  } catch {
    return errorResponse("Failed to delete problem", 500);
  }
}
