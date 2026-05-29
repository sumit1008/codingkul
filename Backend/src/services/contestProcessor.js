import Contest from "../models/Contest.js";
import ContestResult from "../models/ContestResult.js";
import User from "../models/User.js";
import { fetchContestStandings } from "./codeforcesService.js";
import { extractSolvedCount } from "./codeforcesService.js";
import {
  calculateRatingChange,
  calculateXP,
  getAcademyTitle,
  clampRating,
} from "../utils/ratingSystem.js";

/**
 * Process results for a single completed contest.
 * Idempotent — skips if processedResults is already true.
 */
export async function processContest(contestId) {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new Error(`Contest ${contestId} not found`);

  if (contest.processedResults) {
    console.log(`[processor] "${contest.title}" already processed — skipping`);
    return { skipped: true };
  }

  console.log(`[processor] Starting: "${contest.title}" (CF ${contest.codeforcesContestId})`);

  // Mark as in-progress so parallel cron ticks don't double-process
  await Contest.findByIdAndUpdate(contestId, { processingStatus: "processing" });

  // Fetch standings from Codeforces
  let standingsData;
  try {
    standingsData = await fetchContestStandings(contest.codeforcesContestId);
  } catch (err) {
    const isPermanent = err.permanent === true;

    if (isPermanent) {
      // 4xx / API-level rejection — permanently broken, stop retrying
      console.error(
        `[processor] PERMANENT FAILURE "${contest.title}" (CF ${contest.codeforcesContestId}): ${err.message}`
      );
      await Contest.findByIdAndUpdate(contestId, {
        processingStatus:      "failed",
        processingFailedReason: err.message,
        $inc: { processingFailures: 1 },
      });
      return { error: err.message, permanent: true };
    }

    // Transient (network / 5xx) — allow retry on next cron tick
    console.warn(`[processor] Transient failure "${contest.title}": ${err.message}`);
    await Contest.findByIdAndUpdate(contestId, {
      processingStatus: "retry_pending",
      $inc: { processingFailures: 1 },
    });
    return { error: err.message };
  }

  const { problems = [], rows = [] } = standingsData;
  const totalProblems = problems.length;
  const totalParticipants = rows.length;

  if (totalParticipants === 0) {
    console.warn(`[processor] No participants found for contest ${contest.codeforcesContestId}`);
    await Contest.findByIdAndUpdate(contestId, { processedResults: true, processingStatus: "completed" });
    return { processed: 0 };
  }

  // Load all platform users who have a CF handle
  const registeredUsers = await User.find({
    codeforcesHandle: { $exists: true, $ne: "" },
  }).select("_id codeforcesHandle academyRating contestsParticipated contestBestRank");

  const handleMap = new Map(
    registeredUsers.map((u) => [u.codeforcesHandle.toLowerCase(), u])
  );

  const bulkUserOps = [];
  const resultDocs = [];
  let matched = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const handle = row.party?.members?.[0]?.handle;
    if (!handle) continue;

    const user = handleMap.get(handle.toLowerCase());
    if (!user) continue; // not a platform user

    matched++;
    const globalRank = i + 1;
    const solved = extractSolvedCount(row.problemResults);
    const xpEarned = calculateXP(contest.xpReward, globalRank, solved, totalProblems);
    const ratingChange = calculateRatingChange(globalRank, totalParticipants, solved, totalProblems);
    const currentRating = user.academyRating ?? 1200;
    const newRating = clampRating(currentRating + ratingChange);
    const newTitle = getAcademyTitle(newRating);
    const currentBest = user.contestBestRank ?? 999_999;

    resultDocs.push({
      userId: user._id,
      contestId: contest._id,
      cfHandle: handle,
      globalRank,
      solved,
      penalty: row.penalty ?? 0,
      ratingChange,
      xpEarned,
      academyRatingAfter: newRating,
    });

    bulkUserOps.push({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            academyRating: newRating,
            academyRankTitle: newTitle,
            contestBestRank: Math.min(currentBest, globalRank),
          },
          $inc: {
            contestsParticipated: 1,
            contestXP: xpEarned,
            xp: Math.floor(xpEarned / 10), // small bump to general platform XP
          },
          $push: {
            contestHistory: {
              $each: [
                {
                  contestId: contest._id,
                  contestTitle: contest.title,
                  rank: globalRank,
                  solved,
                  ratingChange,
                  xpEarned,
                  ratingAfter: newRating,
                  date: new Date(),
                },
              ],
              $slice: -100, // keep last 100 contest entries per user
            },
          },
        },
      },
    });
  }

  // Write results
  if (resultDocs.length > 0) {
    await ContestResult.insertMany(resultDocs, { ordered: false }).catch((err) => {
      // ordered:false means partial inserts succeed; duplicate key errors are non-fatal
      if (err.code !== 11000) throw err;
    });
  }

  if (bulkUserOps.length > 0) {
    await User.bulkWrite(bulkUserOps, { ordered: false });
  }

  // Mark contest as fully processed
  await Contest.findByIdAndUpdate(contestId, {
    processedResults:  true,
    processingStatus:  "completed",
  });

  console.log(`[processor] Done: "${contest.title}" — ${matched} users processed`);
  return { processed: matched, total: totalParticipants };
}

/**
 * Sync contest statuses based on current time.
 * upcoming → running → completed
 */
export async function syncContestStatuses() {
  const now = new Date();
  const [toRunning, toCompleted] = await Promise.all([
    Contest.updateMany(
      { status: "upcoming", startTime: { $lte: now }, endTime: { $gt: now } },
      { $set: { status: "running" } }
    ),
    Contest.updateMany(
      { status: { $in: ["upcoming", "running"] }, endTime: { $lte: now } },
      { $set: { status: "completed" } }
    ),
  ]);

  const changed = toRunning.modifiedCount + toCompleted.modifiedCount;
  if (changed > 0) {
    console.log(`[statusSync] ${toRunning.modifiedCount} → running, ${toCompleted.modifiedCount} → completed`);
  }
}
