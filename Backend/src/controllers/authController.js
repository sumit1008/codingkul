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
export const googleCallback = asyncHandler(async (req, res) => {
  generateToken(res, req.user._id);

  // Destroy OAuth session — we have JWT now
  req.session.destroy(() => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("ck_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out" });
});
