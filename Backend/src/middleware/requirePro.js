import asyncHandler from "./asyncHandler.js";

/**
 * requirePro
 *
 * Blocks users who have not purchased the Pro plan (isPro !== true).
 * Must be used AFTER `protect` so req.user is populated.
 *
 * Example:
 *   router.get("/premium-route", protect, requirePro, handler);
 */
const requirePro = asyncHandler(async (req, res, next) => {
  if (!req.user?.isPro) {
    res.status(403);
    throw new Error(
      "Pro access required. Upgrade to unlock this feature."
    );
  }
  next();
});

export default requirePro;
