import { Router } from "express";
import passport from "passport";
import { signup, login, getMe, logout, checkUsername, googleCallback } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Email/password auth
router.get("/check-username", checkUsername);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);

// Google OAuth — initiation
router.get("/google", (req, res, next) => {
  console.log("[OAUTH:START] Initiating Google OAuth — session ID:", req.sessionID);
  next();
}, passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

// Google OAuth — callback from Google
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("[OAUTH:CALLBACK] Google callback received");
    console.log("[OAUTH:CALLBACK] session ID:", req.sessionID);
    console.log("[OAUTH:CALLBACK] session keys:", Object.keys(req.session || {}));
    console.log("[OAUTH:CALLBACK] query code present:", !!req.query.code);
    console.log("[OAUTH:CALLBACK] query state present:", !!req.query.state);
    console.log("[OAUTH:CALLBACK] query prompt:", req.query.prompt || "(none)");
    console.log("[OAUTH:CALLBACK] query error:", req.query.error || "(none)");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    failureMessage: false,
    session: true,
  }),
  googleCallback
);

export default router;
