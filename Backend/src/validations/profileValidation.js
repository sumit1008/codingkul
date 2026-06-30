import { z } from "zod";

const optionalString = (max = 200) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalUrl = () =>
  z.string().trim().url("Must be a valid URL").optional().or(z.literal(""));

const personalSchema = z.object({
  mobileNumber: z.string().trim().regex(/^\d{10}$/, "Mobile number must be 10 digits").optional().or(z.literal("")),
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  parentName: optionalString(100),
  parentContact: z.string().trim().regex(/^\d{10}$/, "Parent contact must be 10 digits").optional().or(z.literal("")),
}).partial();

const academicSchema = z.object({
  collegeName: optionalString(200),
  university: optionalString(200),
  degree: optionalString(100),
  branch: optionalString(100),
  currentYear: optionalString(50),
  graduationYear: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
}).partial();

const careerSchema = z.object({
  resumeUrl: optionalUrl(),
  targetRole: optionalString(100),
  preferredLocation: optionalString(100),
  currentCompany: optionalString(100),
  currentPackage: optionalString(50),
  targetPackage: optionalString(50),
}).partial();

const codingProfilesSchema = z.object({
  leetcodeUsername: optionalString(100),
  codechefUsername: optionalString(100),
  gfgUsername: optionalString(100),
  githubUsername: optionalString(100),
  linkedinUrl: optionalUrl(),
  portfolioUrl: optionalUrl(),
}).partial();

const addressSchema = z.object({
  addressLine: optionalString(300),
  city: optionalString(100),
  state: optionalString(100),
  country: optionalString(100),
  pinCode: z.string().trim().regex(/^\d{4,10}$/, "Invalid PIN/postal code").optional().or(z.literal("")),
}).partial();

export const profileUpdateSchema = z.object({
  personal: personalSchema.optional(),
  academic: academicSchema.optional(),
  career: careerSchema.optional(),
  codingProfiles: codingProfilesSchema.optional(),
  address: addressSchema.optional(),
  codeforcesHandle: optionalString(100),
  avatarPresetId: z.coerce.number().int().min(1).max(12).optional(),
});
