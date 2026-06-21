import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/passport.js";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import adminContestRoutes from "./routes/adminContestRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import adminBatchRoutes from "./routes/adminBatchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Trust Railway / Vercel reverse proxy — required for secure cookies + real IPs
if (isProd) app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// Request logging
app.use(morgan(isProd ? "combined" : "dev"));

// CORS — whitelist multiple origins from env var
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000";
const allowedOrigins = isProd
  ? rawOrigins.split(",").map((o) => o.trim())
  : true; // reflect any origin in dev (LAN + localhost)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Global rate limit — 100 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Tighter limit for auth routes — 20 req / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

app.use(globalLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Session — only needed for OAuth handshake state (not persistent auth)
// MongoStore keeps sessions alive across Railway restarts and cold starts
const mongoUri = process.env.MONGO_URI;
console.log("[SESSION] MONGO_URI present:", !!mongoUri);

const sessionStore = MongoStore.create({
  mongoUrl: mongoUri,
  ttl: 10 * 60, // 10 minutes — matches cookie maxAge
  touchAfter: 0,
  collectionName: "oauth_sessions",
});

sessionStore.on("error", (err) => {
  console.error("[SESSION] MongoStore error:", err.message);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "fallback_session_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/admin/contests", adminContestRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/admin/batches", adminBatchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
