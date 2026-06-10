import asyncHandler from "../middleware/asyncHandler.js";
import { canAccessCourse, calculateUpgradePrice, TIER_LEVELS } from "../utils/courseAccess.js";
import { COURSES } from "../data/courses.js";

const enrichCourse = (course, userTier) => {
  const hasAccess = canAccessCourse(userTier, course.tier);
  const upgradePrice =
    !hasAccess && userTier !== "NONE"
      ? calculateUpgradePrice(userTier, course.tier)
      : !hasAccess
      ? course.price
      : null;

  return { ...course, hasAccess, upgradePrice };
};

// GET /api/courses
export const getAllCourses = asyncHandler(async (req, res) => {
  const userTier = req.user.courseTier || "NONE";

  const courses = COURSES.map((c) => enrichCourse(c, userTier));

  res.json({ success: true, data: { courses, userTier } });
});

// GET /api/courses/:slug
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userTier = req.user.courseTier || "NONE";

  const course = COURSES.find((c) => c.slug === slug);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json({ success: true, data: { course: enrichCourse(course, userTier), userTier } });
});
