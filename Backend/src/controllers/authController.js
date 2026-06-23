import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

const safeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  level: user.level,
  xp: user.xp,
  streak: user.streak,
  role: user.role,
  authProvider: user.authProvider,
  isVerified: user.isVerified,
  courseTier: user.courseTier || "NONE",
  purchasedCourses: user.purchasedCourses || [],
  enrolledBatches: user.batches?.length ?? 0,
  // Progress fields — mapped to standard client keys
  rating: user.academyRating ?? 1200,
  rankTitle: user.academyRankTitle ?? "Pupil",
  solved: user.problemsSolved ?? 0,
  contestsParticipated: user.contestsParticipated ?? 0,
});

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const usernameExists = await User.findOne({ username: username.toLowerCase() });
  if (usernameExists) {
    res.status(409);
    throw new Error("Username already taken");
  }

  const user = await User.create({ fullName, username, email, password, authProvider: "local" });
  generateToken(res, user._id);

  res.status(201).json({ success: true, user: safeUser(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Google-only accounts have no password
  if (user.authProvider === "google" && !user.password) {
    res.status(401);
    throw new Error("This account uses Google Sign-In. Please continue with Google.");
  }

  if (!(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  generateToken(res, user._id);
  res.json({ success: true, user: safeUser(user) });
});

// GET /api/auth/me (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: safeUser(req.user) });
});

// GET /api/auth/check-username?username=foo
export const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;
  if (!username || username.length < 3) return res.json({ available: false });
  const exists = await User.findOne({ username: username.toLowerCase() });
  res.json({ available: !exists });
});

// GET /api/auth/google/callback (called after passport processes Google response)
export const googleCallback = (req, res) => {
  console.log("[OAUTH:DONE] googleCallback entered");
  console.log("[OAUTH:DONE] req.user present:", !!req.user);

  // Passport should always set req.user here, but guard against edge cases
  if (!req.user) {
    console.error("[OAUTH:DONE] req.user is null — redirecting to failure");
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }

  const userId = req.user._id;
  console.log("[OAUTH:DONE] userId:", userId.toString());

  let token;
  try {
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
    console.log("[OAUTH:DONE] JWT generated successfully");
  } catch (err) {
    console.error("[OAUTH:DONE] JWT sign failed:", err.message);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }

  // Use /api/auth-redirect (server-side Next.js route) instead of /callback (React page).
  // Server-side sets the cookie in one HTTP hop (~100ms) vs React page approach (~2s).
  // This ensures auth completes before Google Workspace sends its second callback redirect.
  const redirectTarget = `${process.env.CLIENT_URL}/api/auth-redirect?token=${token}`;
  console.log("[OAUTH:DONE] redirecting to:", process.env.CLIENT_URL + "/api/auth-redirect?token=<JWT>");

  // Destroy the OAuth session after extracting the token — ignore destroy errors
  req.session.destroy((err) => {
    if (err) console.error("[OAUTH:DONE] session.destroy error (non-fatal):", err.message);
    res.redirect(redirectTarget);
  });
};

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const clearOpts = { httpOnly: true, secure: isProd, sameSite: "lax", expires: new Date(0) };
  // Clear domain-scoped cookie (email/password + post-fix Google OAuth)
  res.cookie("ck_token", "", { ...clearOpts, domain: isProd ? ".codingkul.in" : undefined });
  // Also clear host-scoped cookie (Google OAuth logins before the domain fix)
  if (isProd) res.cookie("ck_token", "", clearOpts);
  res.json({ success: true, message: "Logged out" });
});
