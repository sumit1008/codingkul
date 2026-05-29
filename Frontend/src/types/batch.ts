export type HomeworkStatus = "pending" | "in-progress" | "completed" | "overdue";
export type HwDifficulty = "Easy" | "Medium" | "Hard";
export type HwPlatform = "LeetCode" | "Codeforces" | "GeeksforGeeks" | "CodingNinjas" | "AtCoder" | "Other";

export interface ScheduleItem {
  _id: string;
  title: string;
  liveAt: string;
  durationMinutes: number;
  meetLink: string;
  lectureId?: string;
  isCompleted: boolean;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export interface BatchSummary {
  _id: string;
  title: string;
  slug: string;
  description: string;
  instructorName: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  schedule: ScheduleItem[];
  announcements: Announcement[];
}

export interface BatchProgress {
  watchedCount: number;
  totalLectures: number;
  progressPercent: number;
  pendingHomework: number;
  nextClass: ScheduleItem | null;
  latestAnnouncement: Announcement | null;
}

export interface BatchWithProgress {
  batch: BatchSummary;
  progress: BatchProgress;
}

export interface BatchActivity {
  batch: { _id: string; title: string; slug: string; instructorName: string };
  nextClass: ScheduleItem | null;
  pendingHomework: number;
  latestAnnouncement: Announcement | null;
  progressPercent: number;
  totalBatches: number;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Lecture {
  _id: string;
  title: string;
  slug: string;
  batchId: string;
  module: string;
  description: string;
  youtubeVideoId: string;
  duration: number;
  order: number;
  attachments: Attachment[];
  unlockAt?: string;
  isLiveClassRecording: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  createdAt: string;
}

export interface LectureDetail extends Lecture {
  homeworkIds: HomeworkSummary[];
}

export interface LectureNavItem {
  _id: string;
  title: string;
  slug: string;
  order: number;
  module: string;
}

export interface HwProblem {
  _id: string;
  title: string;
  platform: HwPlatform;
  link: string;
  tags: string[];
  difficulty: HwDifficulty;
}

export interface HomeworkSummary {
  _id: string;
  title: string;
  dueDate: string;
  difficulty: HwDifficulty;
  xpReward: number;
  isMandatory: boolean;
}

export interface Homework extends HomeworkSummary {
  description: string;
  batchId: string;
  lectureId?: string;
  problems: HwProblem[];
  status: HomeworkStatus;
  solvedCount: number;
  completedAt?: string;
}

export interface HomeworkWithBatch extends Homework {
  batchTitle: string;
  batchSlug: string;
}

export interface BatchDetail {
  batch: BatchSummary & { enrolledStudents: string[] };
  lectures: Lecture[];
  homework: Homework[];
  upcomingClasses: ScheduleItem[];
  announcements: Announcement[];
  progress: {
    watchedCount: number;
    totalLectures: number;
    progressPercent: number;
    completedHomework: number;
    totalHomework: number;
  };
}
