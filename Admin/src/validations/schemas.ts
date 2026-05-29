import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const sheetSchema = z.object({
  title:        z.string().min(2, "Title must be at least 2 characters").max(100),
  slug:         z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  description:  z.string().max(500).optional().default(""),
  thumbnail:    z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  isPublished:  z.boolean().default(false),
  isPremium:    z.boolean().default(false),
  order:        z.number().int().min(0).default(0),
  accentColor:  z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color").default("#6366f1"),
  accentFrom:   z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
  accentTo:     z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#a855f7"),
});

export const problemSchema = z.object({
  title:        z.string().min(2, "Title required").max(200),
  slug:         z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  difficulty:   z.enum(["Easy", "Medium", "Hard"]),
  topic:        z.string().min(1, "Topic required"),
  subtopic:     z.string().optional().default(""),
  platform:     z.enum(["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"]).default("LeetCode"),
  problemUrl:   z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  editorialUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  videoUrl:     z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  notes:        z.string().max(5000).optional().default(""),
  tags:         z.string().optional().default(""),
  companies:    z.string().optional().default(""),
  order:        z.number().int().min(0).default(0),
  sheetId:      z.string().nullable().optional().default(null),
});

export const csvRowSchema = z.object({
  title:        z.string().min(1),
  difficulty:   z.enum(["Easy", "Medium", "Hard"]),
  topic:        z.string().min(1),
  platform:     z.enum(["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"]).optional().default("LeetCode"),
  problemUrl:   z.string().optional().default(""),
  editorialUrl: z.string().optional().default(""),
  videoUrl:     z.string().optional().default(""),
  notes:        z.string().optional().default(""),
  tags:         z.string().optional().default(""),
  companies:    z.string().optional().default(""),
  order:        z.coerce.number().optional().default(0),
});

export const contestSchema = z.object({
  title:                z.string().min(3, "Title must be at least 3 characters").max(200),
  slug:                 z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug: lowercase, numbers, hyphens only").optional().or(z.literal("")).default(""),
  codeforcesContestId:  z.coerce.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").positive("Must be positive"),
  codeforcesContestLink:z.string().url("Must be a valid URL"),
  startTime:            z.string().min(1, "Start time required"),
  endTime:              z.string().min(1, "End time required"),
  duration:             z.string().min(1, "Duration required").default("2 hours"),
  difficulty:           z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  topics:               z.string().optional().default(""),
  xpReward:             z.coerce.number().int().min(0).max(2000).default(200),
  status:               z.enum(["upcoming", "running", "completed"]).default("upcoming"),
});

export const batchSchema = z.object({
  title:          z.string().min(3, "Title must be at least 3 characters").max(200),
  slug:           z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug: lowercase, numbers, hyphens only").optional().or(z.literal("")).default(""),
  description:    z.string().max(2000).optional().default(""),
  courseId:       z.string().optional().default(""),
  instructorName: z.string().min(1, "Instructor name required").max(100),
  meetLink:       z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  bannerImage:    z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
  startDate:      z.string().min(1, "Start date required"),
  endDate:        z.string().min(1, "End date required"),
  isActive:       z.boolean().default(true),
});

export const lectureSchema = z.object({
  title:               z.string().min(2, "Title required").max(200),
  module:              z.string().min(1, "Module required").max(100),
  description:         z.string().max(5000).optional().default(""),
  youtubeVideoId:      z.string().min(1, "YouTube video ID required").max(100),
  duration:            z.coerce.number().int().min(1, "Duration must be positive").default(30),
  order:               z.coerce.number().int().min(0).default(0),
  unlockAt:            z.string().optional().or(z.literal("")).default(""),
  isLiveClassRecording:z.boolean().default(false),
});

export const homeworkSchema = z.object({
  title:       z.string().min(2, "Title required").max(200),
  description: z.string().max(5000).optional().default(""),
  lectureId:   z.string().optional().default(""),
  dueDate:     z.string().min(1, "Due date required"),
  difficulty:  z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  xpReward:    z.coerce.number().int().min(0).max(1000).default(50),
  isMandatory: z.boolean().default(false),
});

export type LoginInput    = z.infer<typeof loginSchema>;
export type SheetInput    = z.infer<typeof sheetSchema>;
export type ProblemInput  = z.infer<typeof problemSchema>;
export type CsvRowInput   = z.infer<typeof csvRowSchema>;
export type ContestInput  = z.infer<typeof contestSchema>;
export type BatchInput    = z.infer<typeof batchSchema>;
export type LectureInput  = z.infer<typeof lectureSchema>;
export type HomeworkInput = z.infer<typeof homeworkSchema>;
