import { z } from "zod";

export const createContestSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  codeforcesContestId: z.number().int().positive(),
  codeforcesContestLink: z.string().url("Must be a valid URL"),
  startTime: z.string().datetime("Must be a valid ISO date"),
  endTime: z.string().datetime("Must be a valid ISO date"),
  duration: z.string().min(1).max(50), // e.g. "2 hours"
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  topics: z.array(z.string().min(1)).min(1).max(10),
  xpReward: z.number().int().min(0).max(2000).default(200),
  status: z.enum(["upcoming", "running", "completed"]).optional().default("upcoming"),
});

export const updateContestSchema = createContestSchema.partial();

export const cfHandleSchema = z.object({
  codeforcesHandle: z.string().min(1).max(24).trim(),
});

/**
 * Parse and validate a request body against a Zod schema.
 * Returns { data } on success or throws a formatted error.
 */
export function validateBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const messages = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
    const err = new Error(messages.join("; "));
    err.statusCode = 400;
    throw err;
  }
  return result.data;
}
