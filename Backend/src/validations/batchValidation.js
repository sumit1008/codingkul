import { z } from "zod";

export const createBatchSchema = z.object({
  title:          z.string().min(3).max(200),
  description:    z.string().max(2000).optional().default(""),
  courseId:       z.string().optional(),
  instructorName: z.string().min(2).max(100),
  meetLink:       z.string().url().optional().or(z.literal("")).default(""),
  bannerImage:    z.string().url().optional().or(z.literal("")).default(""),
  startDate:      z.string().min(1, "Start date required"),
  endDate:        z.string().min(1, "End date required"),
  isActive:       z.boolean().optional().default(true),
});

export const updateBatchSchema = createBatchSchema.partial();

export const createLectureSchema = z.object({
  title:                z.string().min(2).max(300),
  batchId:              z.string().min(1),
  module:               z.string().max(100).optional().default("General"),
  description:          z.string().max(5000).optional().default(""),
  youtubeVideoId:       z.string().min(1, "YouTube video ID required"),
  duration:             z.coerce.number().int().min(0).optional().default(0),
  order:                z.coerce.number().int().min(0).optional().default(0),
  unlockAt:             z.string().optional(),
  isLiveClassRecording: z.boolean().optional().default(false),
  attachments:          z.array(z.object({ name: z.string(), url: z.string().url() })).optional().default([]),
});

export const updateLectureSchema = createLectureSchema.partial().omit({ batchId: true });

export const createHomeworkSchema = z.object({
  title:       z.string().min(2).max(300),
  description: z.string().max(5000).optional().default(""),
  batchId:     z.string().min(1),
  lectureId:   z.string().optional(),
  dueDate:     z.string().min(1, "Due date required"),
  difficulty:  z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
  xpReward:    z.coerce.number().int().min(0).max(1000).optional().default(100),
  isMandatory: z.boolean().optional().default(false),
  problems:    z.array(z.object({
    title:      z.string().min(1),
    platform:   z.enum(["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"]).default("LeetCode"),
    link:       z.string().url().optional().or(z.literal("")).default(""),
    tags:       z.array(z.string()).optional().default([]),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
  })).optional().default([]),
});

export const updateHomeworkSchema = createHomeworkSchema.partial().omit({ batchId: true });

export const announcementSchema = z.object({
  title:    z.string().min(2).max(300),
  content:  z.string().min(1).max(5000),
  isPinned: z.boolean().optional().default(false),
});

export const scheduleItemSchema = z.object({
  title:           z.string().min(2).max(300),
  liveAt:          z.string().min(1, "Live at date required"),
  durationMinutes: z.coerce.number().int().min(1).optional().default(60),
  meetLink:        z.string().url().optional().or(z.literal("")).default(""),
});

export const homeworkProgressSchema = z.object({
  status:      z.enum(["pending", "in-progress", "completed", "overdue"]),
  solvedCount: z.coerce.number().int().min(0).optional(),
});

export function validateBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const err = new Error(result.error.errors[0].message);
    err.statusCode = 400;
    throw err;
  }
  return result.data;
}
