import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startContestCron } from "./cron/contestCron.js";

const PORT = process.env.PORT || 5000;

// Crash guards — log then exit so Railway restarts the container
process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[process] Uncaught Exception:", err);
  process.exit(1);
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  startContestCron();

  // Graceful shutdown for Railway SIGTERM
  const shutdown = (signal) => {
    console.log(`[process] ${signal} received — shutting down gracefully`);
    server.close(() => {
      console.log("[process] HTTP server closed");
      process.exit(0);
    });
    // Force exit after 10 s if still open
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
});
