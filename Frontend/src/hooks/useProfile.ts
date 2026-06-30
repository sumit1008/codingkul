"use client";

import { useCallback, useEffect, useState } from "react";
import { profileApi } from "@/lib/api";
import type { ProfileResponse, ProfileUpdateInput } from "@/types/profile";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileApi.get();
      setProfile(data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: ProfileUpdateInput) => {
    setSaving(true);
    try {
      const updated = await profileApi.update(data);
      setProfile(updated);
      return { success: true as const };
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      return { success: false as const, error: msg || "Failed to update profile" };
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, error, saving, updateProfile, refetch: fetchProfile };
}
