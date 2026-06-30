"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import AvatarPicker from "./AvatarPicker";
import type { Profile, ProfileUpdateInput } from "@/types/profile";

interface Props {
  email: string;
  profile: Profile;
  codeforcesHandle: string;
  saving: boolean;
  onSave: (data: ProfileUpdateInput) => Promise<{ success: boolean; error?: string }>;
}

type Errors = Record<string, string>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#8888aa" }}>{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({
  label, value, onChange, error, type = "text", placeholder, readOnly, full,
}: {
  label: string; value: string; onChange?: (v: string) => void; error?: string;
  type?: string; placeholder?: string; readOnly?: boolean; full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaaacc" }}>{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 px-3 rounded-xl text-sm text-white bg-white/[0.03] border outline-none transition-colors disabled:opacity-60"
        style={{ borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
      />
      {error && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default function ProfileForm({ email, profile, codeforcesHandle, saving, onSave }: Props) {
  const [personal, setPersonal] = useState(profile.personal);
  const [academic, setAcademic] = useState(profile.academic);
  const [career, setCareer] = useState(profile.career);
  const [coding, setCoding] = useState(profile.codingProfiles);
  const [address, setAddress] = useState(profile.address);
  const [cfHandle, setCfHandle] = useState(codeforcesHandle);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => { setPersonal(profile.personal); }, [profile.personal]);
  useEffect(() => { setAcademic(profile.academic); }, [profile.academic]);
  useEffect(() => { setCareer(profile.career); }, [profile.career]);
  useEffect(() => { setCoding(profile.codingProfiles); }, [profile.codingProfiles]);
  useEffect(() => { setAddress(profile.address); }, [profile.address]);
  useEffect(() => { setCfHandle(codeforcesHandle); }, [codeforcesHandle]);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (personal.mobileNumber && !/^\d{10}$/.test(personal.mobileNumber)) errs.mobileNumber = "Must be 10 digits";
    if (personal.parentContact && !/^\d{10}$/.test(personal.parentContact)) errs.parentContact = "Must be 10 digits";
    if (academic.graduationYear && (academic.graduationYear < 1990 || academic.graduationYear > 2100)) {
      errs.graduationYear = "Enter a valid year";
    }
    if (address.pinCode && !/^\d{4,10}$/.test(address.pinCode)) errs.pinCode = "Invalid PIN code";
    const urlFields: [string, string][] = [
      ["resumeUrl", career.resumeUrl],
      ["linkedinUrl", coding.linkedinUrl],
      ["portfolioUrl", coding.portfolioUrl],
    ];
    for (const [key, val] of urlFields) {
      if (val && !/^https?:\/\/.+/.test(val)) errs[key] = "Must start with http:// or https://";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const result = await onSave({
      personal,
      academic,
      career,
      codingProfiles: coding,
      address,
      codeforcesHandle: cfHandle,
    });

    if (result.success) toast.success("Profile updated");
    else toast.error(result.error || "Failed to save");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl p-6" style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#8888aa" }}>Avatar</h3>
        <AvatarPicker selectedId={personal.avatarPresetId} onSelect={(id) => setPersonal((p) => ({ ...p, avatarPresetId: id }))} />
      </section>

      <Section title="Personal Details">
        <Field label="Email" value={email} readOnly />
        <Field label="Mobile Number" value={personal.mobileNumber} onChange={(v) => setPersonal((p) => ({ ...p, mobileNumber: v }))} error={errors.mobileNumber} placeholder="9876543210" />
        <Field label="Date of Birth" type="date" value={toDateInput(personal.dateOfBirth)} onChange={(v) => setPersonal((p) => ({ ...p, dateOfBirth: v }))} />
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaaacc" }}>Gender (optional)</label>
          <select
            value={personal.gender}
            onChange={(e) => setPersonal((p) => ({ ...p, gender: e.target.value as typeof p.gender }))}
            className="w-full h-10 px-3 rounded-xl text-sm text-white bg-white/[0.03] border outline-none"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Field label="Parent / Father Name (optional)" value={personal.parentName} onChange={(v) => setPersonal((p) => ({ ...p, parentName: v }))} />
        <Field label="Parent Contact (optional)" value={personal.parentContact} onChange={(v) => setPersonal((p) => ({ ...p, parentContact: v }))} error={errors.parentContact} placeholder="9876543210" />
      </Section>

      <Section title="Academic Details">
        <Field label="College Name" value={academic.collegeName} onChange={(v) => setAcademic((a) => ({ ...a, collegeName: v }))} full />
        <Field label="University" value={academic.university} onChange={(v) => setAcademic((a) => ({ ...a, university: v }))} />
        <Field label="Degree" value={academic.degree} onChange={(v) => setAcademic((a) => ({ ...a, degree: v }))} placeholder="B.Tech" />
        <Field label="Branch / Specialization" value={academic.branch} onChange={(v) => setAcademic((a) => ({ ...a, branch: v }))} placeholder="Computer Science" />
        <Field label="Current Year / Semester" value={academic.currentYear} onChange={(v) => setAcademic((a) => ({ ...a, currentYear: v }))} placeholder="3rd Year, 6th Sem" />
        <Field
          label="Graduation Year"
          type="number"
          value={academic.graduationYear?.toString() ?? ""}
          onChange={(v) => setAcademic((a) => ({ ...a, graduationYear: v ? Number(v) : null }))}
          error={errors.graduationYear}
          placeholder="2027"
        />
      </Section>

      <Section title="Career Details">
        <Field label="Resume URL (optional)" value={career.resumeUrl} onChange={(v) => setCareer((c) => ({ ...c, resumeUrl: v }))} error={errors.resumeUrl} full />
        <Field label="Target Role (optional)" value={career.targetRole} onChange={(v) => setCareer((c) => ({ ...c, targetRole: v }))} placeholder="SDE-1" />
        <Field label="Preferred Location (optional)" value={career.preferredLocation} onChange={(v) => setCareer((c) => ({ ...c, preferredLocation: v }))} />
        <Field label="Current Company (optional)" value={career.currentCompany} onChange={(v) => setCareer((c) => ({ ...c, currentCompany: v }))} />
        <Field label="Current Package (optional)" value={career.currentPackage} onChange={(v) => setCareer((c) => ({ ...c, currentPackage: v }))} placeholder="₹8 LPA" />
        <Field label="Target Package (optional)" value={career.targetPackage} onChange={(v) => setCareer((c) => ({ ...c, targetPackage: v }))} placeholder="₹15 LPA" />
      </Section>

      <Section title="Coding & Professional Profiles">
        <Field label="LeetCode Username" value={coding.leetcodeUsername} onChange={(v) => setCoding((c) => ({ ...c, leetcodeUsername: v }))} />
        <Field label="Codeforces Username" value={cfHandle} onChange={setCfHandle} />
        <Field label="CodeChef Username" value={coding.codechefUsername} onChange={(v) => setCoding((c) => ({ ...c, codechefUsername: v }))} />
        <Field label="GeeksforGeeks Username" value={coding.gfgUsername} onChange={(v) => setCoding((c) => ({ ...c, gfgUsername: v }))} />
        <Field label="GitHub Username" value={coding.githubUsername} onChange={(v) => setCoding((c) => ({ ...c, githubUsername: v }))} />
        <Field label="LinkedIn URL" value={coding.linkedinUrl} onChange={(v) => setCoding((c) => ({ ...c, linkedinUrl: v }))} error={errors.linkedinUrl} />
        <Field label="Portfolio Website" value={coding.portfolioUrl} onChange={(v) => setCoding((c) => ({ ...c, portfolioUrl: v }))} error={errors.portfolioUrl} full />
      </Section>

      <Section title="Address">
        <Field label="Address Line" value={address.addressLine} onChange={(v) => setAddress((a) => ({ ...a, addressLine: v }))} full />
        <Field label="City" value={address.city} onChange={(v) => setAddress((a) => ({ ...a, city: v }))} />
        <Field label="State" value={address.state} onChange={(v) => setAddress((a) => ({ ...a, state: v }))} />
        <Field label="Country" value={address.country} onChange={(v) => setAddress((a) => ({ ...a, country: v }))} />
        <Field label="PIN Code" value={address.pinCode} onChange={(v) => setAddress((a) => ({ ...a, pinCode: v }))} error={errors.pinCode} />
      </Section>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full h-11 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Profile
      </button>
    </div>
  );
}
