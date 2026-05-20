const CF_BASE = "https://codeforces.com/api";

interface CfContest {
  id: number;
  name: string;
  phase: "BEFORE" | "CODING" | "PENDING_SYSTEM_TEST" | "SYSTEM_TEST" | "FINISHED";
  type: string;
  durationSeconds: number;
  startTimeSeconds: number;
}

interface CfApiResponse<T> {
  status: "OK" | "FAILED";
  result: T;
  comment?: string;
}

async function cfFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${CF_BASE}${endpoint}`, {
    cache: "no-store",
    headers: { "User-Agent": "AlgoShashtra-Admin/1.0" },
  });
  if (!res.ok) throw new Error(`CF API HTTP ${res.status}`);
  const json: CfApiResponse<T> = await res.json();
  if (json.status !== "OK") throw new Error(json.comment ?? "CF API returned FAILED");
  return json.result;
}

export async function fetchCFContestInfo(contestId: number): Promise<CfContest | null> {
  try {
    const contests = await cfFetch<CfContest[]>("/contest.list?gym=false");
    return contests.find((c) => c.id === contestId) ?? null;
  } catch {
    return null;
  }
}

export function cfContestPhaseToStatus(phase: string): "upcoming" | "running" | "completed" {
  if (phase === "BEFORE") return "upcoming";
  if (phase === "CODING") return "running";
  return "completed";
}

export async function getCFParticipantCount(contestId: number): Promise<number | null> {
  try {
    const data = await cfFetch<{ problems: unknown[]; rows: unknown[] }>(
      `/contest.standings?contestId=${contestId}&from=1&count=1&showUnofficial=false`
    );
    return data.rows?.length ?? null;
  } catch {
    return null;
  }
}
