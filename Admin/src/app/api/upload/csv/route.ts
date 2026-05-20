import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Problem } from "@/models/Problem";
import { Sheet } from "@/models/Sheet";
import { csvRowSchema } from "@/validations/schemas";
import { errorResponse, successResponse, slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows, sheetId } = body as { rows: Record<string, string>[]; sheetId?: string };

    if (!Array.isArray(rows) || rows.length === 0) {
      return errorResponse("No rows provided", 400);
    }
    if (rows.length > 500) {
      return errorResponse("Maximum 500 rows per upload", 400);
    }

    await connectDB();

    const results = { inserted: 0, duplicates: 0, errors: [] as string[] };

    for (let i = 0; i < rows.length; i++) {
      const parsed = csvRowSchema.safeParse(rows[i]);
      if (!parsed.success) {
        results.errors.push(`Row ${i + 1}: ${parsed.error.errors[0].message}`);
        continue;
      }

      const d = parsed.data;
      const slug = slugify(d.title);

      const existing = await Problem.findOne({ slug });
      if (existing) {
        results.duplicates++;
        continue;
      }

      await Problem.create({
        title:        d.title,
        slug,
        difficulty:   d.difficulty,
        topic:        d.topic,
        platform:     d.platform ?? "LeetCode",
        problemUrl:   d.problemUrl ?? "",
        editorialUrl: d.editorialUrl ?? "",
        videoUrl:     d.videoUrl ?? "",
        notes:        d.notes ?? "",
        tags:         d.tags ? d.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        companies:    d.companies ? d.companies.split(",").map((c) => c.trim()).filter(Boolean) : [],
        order:        d.order ?? i,
        sheetId:      sheetId ?? null,
      });

      results.inserted++;
    }

    // update sheet totalProblems
    if (sheetId && results.inserted > 0) {
      await Sheet.findByIdAndUpdate(sheetId, { $inc: { totalProblems: results.inserted } });
    }

    return successResponse(results, `Imported ${results.inserted} problems`);
  } catch {
    return errorResponse("CSV import failed", 500);
  }
}
