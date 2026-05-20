import cron from "node-cron";
import Contest from "../models/Contest.js";
import { processContest, syncContestStatuses } from "../services/contestProcessor.js";

let isRunning = false;

async function runContestJob() {
  if (isRunning) {
    console.log("[cron] Previous run still active — skipping this tick");
    return;
  }
  isRunning = true;

  try {
    // 1. Sync status transitions (upcoming → running → completed)
    await syncContestStatuses();

    // 2. Process any completed-but-unprocessed contests
    const pending = await Contest.find({
      status: "completed",
      processedResults: false,
    }).select("_id title");

    if (pending.length === 0) return;

    console.log(`[cron] ${pending.length} contest(s) pending result processing`);

    for (const contest of pending) {
      try {
        await processContest(contest._id);
      } catch (err) {
        console.error(`[cron] Failed to process "${contest.title}": ${err.message}`);
      }
    }
  } catch (err) {
    console.error("[cron] Job error:", err.message);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the contest cron job.
 * Runs every 5 minutes.
 */
export function startContestCron() {
  // Run once immediately on startup to catch missed processing
  runContestJob().catch(console.error);

  // Then every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runContestJob().catch(console.error);
  });

  console.log("✓ Contest cron started (every 5 minutes)");
}
