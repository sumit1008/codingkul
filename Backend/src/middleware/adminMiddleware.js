import asyncHandler from "./asyncHandler.js";

/**
 * Must be used AFTER `protect` middleware (which sets req.user).
 * Allows only users with role === "admin".
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized — login required");
  }

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden — admin access required");
  }

  next();
});
