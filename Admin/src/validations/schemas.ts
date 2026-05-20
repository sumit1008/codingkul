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

export type LoginInput    = z.infer<typeof loginSchema>;
export type SheetInput    = z.infer<typeof sheetSchema>;
export type ProblemInput  = z.infer<typeof problemSchema>;
export type CsvRowInput   = z.infer<typeof csvRowSchema>;
