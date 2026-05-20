export const TIER_LEVELS = {
  NONE: 0,
  FOUNDATION: 1,
  ACCELERATOR: 2,
  PLACEMENT: 3,
};

export const COURSE_PRICES = {
  FOUNDATION: 4999,
  ACCELERATOR: 6999,
  PLACEMENT: 9999,
};

export const TIER_LABELS = {
  NONE: "Free User",
  FOUNDATION: "Foundation Student",
  ACCELERATOR: "Accelerator Student",
  PLACEMENT: "Placement Student",
};

export function canAccessCourse(userTier, courseTier) {
  return (TIER_LEVELS[userTier] ?? 0) >= (TIER_LEVELS[courseTier] ?? 0);
}

export function calculateUpgradePrice(currentTier, targetTier) {
  const currentPrice = COURSE_PRICES[currentTier] ?? 0;
  const targetPrice = COURSE_PRICES[targetTier];
  if (!targetPrice) return null;
  return Math.max(0, targetPrice - currentPrice);
}
