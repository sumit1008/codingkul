import Purchase from "../models/Purchase.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { profileUpdateSchema } from "../validations/profileValidation.js";
import { validateBody } from "../validations/batchValidation.js";
import { renderInvoicePdf } from "../services/invoiceService.js";
import { TIER_LABELS } from "../utils/courseAccess.js";
import PDFDocument from "pdfkit";

const COMPLETION_FIELDS = (profile, codeforcesHandle) => [
  profile?.personal?.mobileNumber,
  profile?.personal?.dateOfBirth,
  profile?.personal?.gender,
  profile?.personal?.parentName,
  profile?.personal?.parentContact,
  profile?.academic?.collegeName,
  profile?.academic?.university,
  profile?.academic?.degree,
  profile?.academic?.branch,
  profile?.academic?.currentYear,
  profile?.academic?.graduationYear,
  profile?.career?.resumeUrl,
  profile?.career?.targetRole,
  profile?.career?.preferredLocation,
  profile?.career?.currentCompany,
  profile?.career?.currentPackage,
  profile?.career?.targetPackage,
  profile?.codingProfiles?.leetcodeUsername,
  profile?.codingProfiles?.codechefUsername,
  profile?.codingProfiles?.gfgUsername,
  profile?.codingProfiles?.githubUsername,
  profile?.codingProfiles?.linkedinUrl,
  profile?.codingProfiles?.portfolioUrl,
  codeforcesHandle,
  profile?.address?.addressLine,
  profile?.address?.city,
  profile?.address?.state,
  profile?.address?.country,
  profile?.address?.pinCode,
];

function computeCompletionPercentage(profile, codeforcesHandle) {
  const fields = COMPLETION_FIELDS(profile, codeforcesHandle);
  const filled = fields.filter((v) => v !== undefined && v !== null && v !== "").length;
  return Math.round((filled / fields.length) * 100);
}

// GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  // Lazily persist the randomly-assigned avatar preset so it's stable across reloads.
  if (!user.profile?.personal?.avatarPresetId) {
    user.profile.personal.avatarPresetId = 1 + Math.floor(Math.random() * 12);
    await user.save();
  }

  const completionPercentage = computeCompletionPercentage(user.profile, user.codeforcesHandle);

  res.json({
    success: true,
    data: {
      fullName: user.fullName,
      email: user.email,
      profile: user.profile,
      codeforcesHandle: user.codeforcesHandle,
      completionPercentage,
    },
  });
});

// PATCH /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const data = validateBody(profileUpdateSchema, req.body);
  const user = req.user;

  if (data.personal) Object.assign(user.profile.personal, data.personal);
  if (data.academic) Object.assign(user.profile.academic, data.academic);
  if (data.career) Object.assign(user.profile.career, data.career);
  if (data.codingProfiles) Object.assign(user.profile.codingProfiles, data.codingProfiles);
  if (data.address) Object.assign(user.profile.address, data.address);
  if (data.avatarPresetId) user.profile.personal.avatarPresetId = data.avatarPresetId;
  if (data.codeforcesHandle !== undefined) user.codeforcesHandle = data.codeforcesHandle;

  await user.save();

  const completionPercentage = computeCompletionPercentage(user.profile, user.codeforcesHandle);

  res.json({
    success: true,
    message: "Profile updated",
    data: {
      profile: user.profile,
      codeforcesHandle: user.codeforcesHandle,
      completionPercentage,
    },
  });
});

// GET /api/profile/purchases
export const getPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ userId: req.user._id }).sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: purchases });
});

// GET /api/profile/subscription
export const getSubscription = asyncHandler(async (req, res) => {
  const courseTier = req.user.courseTier || "NONE";

  if (courseTier === "NONE") {
    return res.json({ success: true, data: { courseTier: "NONE", status: null, purchase: null } });
  }

  const latestPurchase = await Purchase.findOne({ userId: req.user._id, courseTier })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: {
      courseTier,
      tierLabel: TIER_LABELS[courseTier],
      status: "Active",
      purchase: latestPurchase,
    },
  });
});

// GET /api/profile/invoices/:purchaseId/download
export const downloadInvoice = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.purchaseId).lean();

  if (!purchase || purchase.userId.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${purchase.invoiceNumber}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);
  renderInvoicePdf(doc, { purchase, user: req.user });
});
