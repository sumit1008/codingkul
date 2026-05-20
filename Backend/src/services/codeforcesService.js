import axios from "axios";

const CF_BASE = "https://codeforces.com/api";
const TIMEOUT_MS = 12_000;
const MAX_RETRIES = 3;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory response cache
const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

async function cfRequest(endpoint, params = {}, attempt = 0) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${CF_BASE}/${endpoint}`, {
      params,
      timeout: TIMEOUT_MS,
    });

    if (data.status !== "OK") {
      throw new Error(`Codeforces API error: ${data.comment ?? "Unknown error"}`);
    }

    setCache(cacheKey, data.result);
    return data.result;
  } catch (err) {
    if (attempt < MAX_RETRIES - 1) {
      const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, delay));
      return cfRequest(endpoint, params, attempt + 1);
    }
    throw new Error(`CF ${endpoint} failed after ${MAX_RETRIES} attempts: ${err.message}`);
  }
}

/**
 * Fetch contest standings.
 * Returns { contest, problems, rows } from CF API.
 */
export async function fetchContestStandings(cfContestId, count = 5000) {
  return cfRequest("contest.standings", {
    contestId: cfContestId,
    showUnofficial: false,
    count,
  });
}

/**
 * Fetch rating changes for a contest (official participants only).
 */
export async function fetchRatingChanges(cfContestId) {
  return cfRequest("contest.ratingChanges", { contestId: cfContestId });
}

/**
 * Fetch user info for an array of handles.
 * CF supports semicolon-separated handles.
 */
export async function fetchUserInfo(handles) {
  if (!handles || handles.length === 0) return [];
  const handleStr = handles.join(";");
  return cfRequest("user.info", { handles: handleStr });
}

/**
 * Check if a CF handle exists and return basic info.
 */
export async function validateCFHandle(handle) {
  try {
    const result = await fetchUserInfo([handle]);
    return result?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Extract solved problem count from a standings row.
 * Works for both ICPC and scoring-based contests.
 */
export function extractSolvedCount(problemResults = []) {
  return problemResults.filter((p) => {
    // Scoring format: points > 0
    if (typeof p.points === "number" && p.points > 0) return true;
    // ICPC format: bestSubmissionTimeSeconds >= 0
    if (typeof p.bestSubmissionTimeSeconds === "number" && p.bestSubmissionTimeSeconds >= 0) return true;
    return false;
  }).length;
}
