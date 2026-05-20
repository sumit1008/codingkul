const TITLES = [
  { title: "Beginner",         min: 0    },
  { title: "Pupil",            min: 1200 },
  { title: "Specialist",       min: 1400 },
  { title: "Expert",           min: 1600 },
  { title: "Candidate Master", min: 1800 },
];

export function getAcademyTitle(rating) {
  for (let i = TITLES.length - 1; i >= 0; i--) {
    if (rating >= TITLES[i].min) return TITLES[i].title;
  }
  return "Beginner";
}

/**
 * Calculate academy rating change based on contest performance.
 * Returns a value in range [-80, +80] adjusted by solve ratio.
 */
export function calculateRatingChange(globalRank, totalParticipants, solved, totalProblems) {
  if (!totalParticipants || totalParticipants <= 0) return 0;

  const percentile = 1 - (globalRank / totalParticipants);
  // Base: -80 to +80 based on rank percentile
  const base = Math.round((percentile - 0.5) * 160);
  // Solve bonus: 0 to +20 based on solve ratio
  const solveRatio = totalProblems > 0 ? solved / totalProblems : 0;
  const bonus = Math.round(solveRatio * 20);

  return Math.max(-100, Math.min(100, base + bonus));
}

/**
 * Calculate XP earned for a contest.
 * Base + bonuses for top ranks and perfect solves.
 */
export function calculateXP(baseXP, globalRank, solved, totalProblems) {
  let xp = baseXP;
  if (globalRank <= 3)  xp += 300;
  else if (globalRank <= 10) xp += 200;
  else if (globalRank <= 25) xp += 100;
  if (totalProblems > 0 && solved >= totalProblems) xp += 100;
  return Math.max(10, xp);
}

export function clampRating(rating) {
  return Math.max(800, Math.min(3500, rating));
}

export const TITLES_LIST = TITLES;
