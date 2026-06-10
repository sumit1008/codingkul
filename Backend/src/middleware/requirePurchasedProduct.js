import asyncHandler from "./asyncHandler.js";

/**
 * Middleware: user must have purchased at least one product.
 * Drop-in replacement for requireTier("FOUNDATION") on batch routes.
 */
export const requireAnyProduct = asyncHandler(async (req, res, next) => {
  const purchased = req.user?.purchasedProducts || [];
  if (purchased.length === 0) {
    res.status(403);
    throw new Error("Purchase a course to access this content.");
  }
  next();
});

/**
 * Factory: user must have purchased the specific productId.
 * Usage: router.use(requirePurchasedProduct("foundation"))
 */
export function requirePurchasedProduct(productId) {
  return asyncHandler(async (req, res, next) => {
    const purchased = req.user?.purchasedProducts || [];
    if (!purchased.some((p) => p.productId === productId)) {
      res.status(403);
      throw new Error(`Purchase the ${productId} course to access this content.`);
    }
    next();
  });
}
