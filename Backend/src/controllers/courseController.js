import asyncHandler from "../middleware/asyncHandler.js";
import { COURSES } from "../data/courses.js";
import { PRODUCT_TIER_RANK, getHighestPurchasedProduct } from "../data/products.js";

function getHighestRank(purchasedProducts) {
  if (!purchasedProducts?.length) return 0;
  return Math.max(...purchasedProducts.map((p) => PRODUCT_TIER_RANK[p.productId] ?? 0));
}

const enrichCourse = (course, purchasedProducts) => {
  const userRank  = getHighestRank(purchasedProducts);
  const courseRank = PRODUCT_TIER_RANK[course.slug] ?? 0;
  const hasAccess = userRank > 0 && userRank >= courseRank;

  let upgradePrice = null;
  if (!hasAccess) {
    const highest = getHighestPurchasedProduct(purchasedProducts);
    if (highest) {
      // Deduct what user already paid (paise → rupees)
      upgradePrice = Math.max(0, course.price - highest.price / 100);
    } else {
      upgradePrice = course.price; // full price for first-time buyers
    }
  }

  return { ...course, hasAccess, upgradePrice };
};

// GET /api/courses
export const getAllCourses = asyncHandler(async (req, res) => {
  const purchasedProducts = req.user.purchasedProducts || [];
  const courses = COURSES.map((c) => enrichCourse(c, purchasedProducts));
  res.json({ success: true, data: { courses } });
});

// GET /api/courses/:slug
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const purchasedProducts = req.user.purchasedProducts || [];

  const course = COURSES.find((c) => c.slug === slug);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json({ success: true, data: { course: enrichCourse(course, purchasedProducts) } });
});
