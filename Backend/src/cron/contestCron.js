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
    //    Exclude permanently failed ones — they require manual investigation/fix.
    const pending = await Contest.find({
      status: "completed",
      processedResults: false,
      processingStatus: { $nin: ["failed", "processing"] },
    }).select("_id title processingStatus processingFailures");

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
export async function startContestCron() {
  // Reset any contests stuck in "processing" from a previous server crash
  try {
    const stale = await Contest.updateMany(
      { status: "completed", processedResults: false, processingStatus: "processing" },
      { $set: { processingStatus: "retry_pending" } }
    );
    if (stale.modifiedCount > 0) {
      console.log(`[cron] Reset ${stale.modifiedCount} stale "processing" contest(s) → retry_pending`);
    }
  } catch (err) {
    console.error("[cron] Failed to reset stale processing states:", err.message);
  }

  // Run once immediately on startup to catch missed processing
  runContestJob().catch(console.error);

  // Then every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runContestJob().catch(console.error);
  });

  console.log("✓ Contest cron started (every 5 minutes)");
}
