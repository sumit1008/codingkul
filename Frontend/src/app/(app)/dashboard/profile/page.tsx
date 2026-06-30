"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, User as UserIcon, CreditCard, Receipt, GraduationCap, Sparkles, Award, Briefcase, Gift, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { profileApi } from "@/lib/api";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileCompletionBanner from "@/components/profile/ProfileCompletionBanner";
import SubscriptionCard from "@/components/profile/SubscriptionCard";
import PurchaseTimeline from "@/components/profile/PurchaseTimeline";
import InvoiceHistory from "@/components/profile/InvoiceHistory";
import MyLearning from "@/components/profile/MyLearning";
import ComingSoonSection from "@/components/profile/ComingSoonSection";
import type { Purchase, Subscription } from "@/types/profile";

type Tab = "profile" | "subscription" | "purchases" | "learning" | "more";

const TABS: { id: Tab; label: string; icon: typeof UserIcon }[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "purchases", label: "Purchases & Invoices", icon: Receipt },
  { id: "learning", label: "My Learning", icon: GraduationCap },
  { id: "more", label: "More", icon: Sparkles },
];

export default function ProfilePage() {
  const { profile, loading, error, saving, updateProfile, refetch } = useProfile();
  const [tab, setTab] = useState<Tab>("profile");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  const fetchExtra = useCallback(async () => {
    setLoadingExtra(true);
    try {
      const [sub, purch] = await Promise.all([profileApi.getSubscription(), profileApi.getPurchases()]);
      setSubscription(sub);
      setPurchases(purch);
    } catch {
      // surfaced via empty states in each section
    } finally {
      setLoadingExtra(false);
    }
  }, []);

  useEffect(() => { fetchExtra(); }, [fetchExtra]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#555577" }} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="w-8 h-8 mb-3" style={{ color: "#ef4444" }} />
        <p className="text-sm mb-4" style={{ color: "#8888aa" }}>{error || "Something went wrong"}</p>
        <button onClick={refetch} className="text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "#8888aa" }}>Manage your personal details, subscription, and learning</p>
      </div>

      <ProfileCompletionBanner percentage={profile.completionPercentage} onComplete={() => setTab("profile")} />

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0"
            style={
              tab === id
                ? { background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.2))", border: "1px solid rgba(99,102,241,0.3)", color: "#fff" }
                : { border: "1px solid transparent", color: "#8888aa" }
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <ProfileForm
          email={profile.email}
          profile={profile.profile}
          codeforcesHandle={profile.codeforcesHandle}
          saving={saving}
          onSave={updateProfile}
        />
      )}

      {tab === "subscription" && (
        loadingExtra ? <CenteredSpinner /> : <SubscriptionCard subscription={subscription!} />
      )}

      {tab === "purchases" && (
        loadingExtra ? <CenteredSpinner /> : (
          <div className="space-y-6">
            <PurchaseTimeline purchases={purchases} />
            <InvoiceHistory purchases={purchases} />
          </div>
        )
      )}

      {tab === "learning" && (
        loadingExtra ? <CenteredSpinner /> : <MyLearning purchases={purchases} />
      )}

      {tab === "more" && (
        <div className="space-y-3">
          <ComingSoonSection title="Certificates" description="Download completion certificates for finished courses" icon={Award} />
          <ComingSoonSection title="Placement Status" description="Track your placement journey and interview pipeline" icon={Briefcase} />
          <ComingSoonSection title="Referral Program" description="Invite friends and earn rewards" icon={Gift} />
          <ComingSoonSection title="Course Progress" description="Detailed lecture and assignment completion tracking" icon={TrendingUp} />
        </div>
      )}
    </div>
  );
}

function CenteredSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#555577" }} />
    </div>
  );
}
