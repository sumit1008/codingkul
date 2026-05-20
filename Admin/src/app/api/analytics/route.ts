import { connectDB } from "@/lib/db";
import { Problem } from "@/models/Problem";
import { Sheet } from "@/models/Sheet";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();

    const [
      totalSheets,
      totalProblems,
      publishedSheets,
      diffAgg,
      topicAgg,
      platformAgg,
      recentProblems,
    ] = await Promise.all([
      Sheet.countDocuments(),
      Problem.countDocuments(),
      Sheet.countDocuments({ isPublished: true }),
      Problem.aggregate([{ $group: { _id: "$difficulty", count: { $sum: 1 } } }]),
      Problem.aggregate([
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Problem.aggregate([{ $group: { _id: "$platform", count: { $sum: 1 } } }]),
      Problem.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const difficultyBreakdown = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
    diffAgg.forEach((d) => { difficultyBreakdown[d._id] = d.count; });

    return successResponse({
      totalSheets,
      totalProblems,
      publishedSheets,
      difficultyBreakdown,
      topicBreakdown:    topicAgg.map((t) => ({ topic: t._id, count: t.count })),
      platformBreakdown: platformAgg.map((p) => ({ platform: p._id, count: p.count })),
      recentProblems,
    });
  } catch {
    return errorResponse("Failed to load analytics", 500);
  }
}
