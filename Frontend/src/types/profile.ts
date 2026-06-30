export interface ProfilePersonal {
  mobileNumber: string;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | "";
  parentName: string;
  parentContact: string;
  avatarPresetId: number;
}

export interface ProfileAcademic {
  collegeName: string;
  university: string;
  degree: string;
  branch: string;
  currentYear: string;
  graduationYear: number | null;
}

export interface ProfileCareer {
  resumeUrl: string;
  targetRole: string;
  preferredLocation: string;
  currentCompany: string;
  currentPackage: string;
  targetPackage: string;
}

export interface ProfileCodingProfiles {
  leetcodeUsername: string;
  codechefUsername: string;
  gfgUsername: string;
  githubUsername: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface ProfileAddress {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface Profile {
  personal: ProfilePersonal;
  academic: ProfileAcademic;
  career: ProfileCareer;
  codingProfiles: ProfileCodingProfiles;
  address: ProfileAddress;
}

export interface ProfileResponse {
  fullName: string;
  email: string;
  profile: Profile;
  codeforcesHandle: string;
  completionPercentage: number;
}

export type ProfileUpdateInput = {
  personal?: Partial<ProfilePersonal>;
  academic?: Partial<ProfileAcademic>;
  career?: Partial<ProfileCareer>;
  codingProfiles?: Partial<ProfileCodingProfiles>;
  address?: Partial<ProfileAddress>;
  codeforcesHandle?: string;
  avatarPresetId?: number;
};

export interface Purchase {
  _id: string;
  userId: string;
  courseTier: "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";
  courseTitle: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  couponId: string | null;
  couponCode: string;
  gstRate: number;
  gstAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  invoiceNumber: string;
  paymentStatus: "SUCCESS";
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  courseTier: "NONE" | "FOUNDATION" | "ACCELERATOR" | "PLACEMENT";
  tierLabel?: string;
  status: "Active" | null;
  purchase: Purchase | null;
}
