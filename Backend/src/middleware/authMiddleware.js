import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";
import { TIER_LEVELS } from "../utils/courseAccess.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.ck_token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized — user not found");
  }

  next();
});

/**
 * requireTier(minTier)
 *
 * Route-level middleware that blocks users whose courseTier is below the
 * required tier. Must be used AFTER `protect` so req.user is populated.
 *
 * Example:
 *   router.use(protect, requireTier("FOUNDATION"));
 */
export const requireTier = (minTier) =>
  asyncHandler(async (req, res, next) => {
    const userLevel = TIER_LEVELS[req.user?.courseTier] ?? 0;
    const required  = TIER_LEVELS[minTier] ?? 1;

    if (userLevel < required) {
      res.status(403);
      throw new Error(
        `This feature requires the ${minTier} tier or higher. Upgrade your plan to continue.`
      );
    }

    next();
  });
