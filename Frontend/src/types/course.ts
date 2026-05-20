export type CourseTier = "NONE" | "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";

export interface CourseLecture {
  title: string;
  duration: string;
  type: "video" | "practice" | "interview" | "workshop";
}

export interface CourseModule {
  title: string;
  duration: string;
  lectures: CourseLecture[];
}

export interface Course {
  slug: string;
  title: string;
  shortTitle: string;
  price: number;
  tier: CourseTier;
  tagline: string;
  color: string;
  badge: string | null;
  target: string;
  features: string[];
  validity: string[];
  outcome: string;
  modules: CourseModule[];
  hasAccess: boolean;
  upgradePrice: number | null;
}

export interface CoursesApiResponse {
  success: boolean;
  data: {
    courses: Course[];
    userTier: CourseTier;
  };
}

export interface CourseApiResponse {
  success: boolean;
  data: {
    course: Course;
    userTier: CourseTier;
  };
}

export const TIER_LABELS: Record<CourseTier, string> = {
  NONE: "Free User",
  FOUNDATION: "Foundation Student",
  ACCELERATOR: "Accelerator Student",
  PLACEMENT: "Placement Student",
};

export const TIER_LEVELS: Record<CourseTier, number> = {
  NONE: 0,
  FOUNDATION: 1,
  ACCELERATOR: 2,
  PLACEMENT: 3,
};

export const COURSE_PRICES: Record<string, number> = {
  FOUNDATION: 4999,
  ACCELERATOR: 6999,
  PLACEMENT: 9999,
};

export function canAccessCourse(userTier: CourseTier, courseTier: CourseTier): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[courseTier];
}

export function calculateUpgradePrice(currentTier: CourseTier, targetTier: CourseTier): number {
  const current = COURSE_PRICES[currentTier] ?? 0;
  const target = COURSE_PRICES[targetTier] ?? 0;
  return Math.max(0, target - current);
}
