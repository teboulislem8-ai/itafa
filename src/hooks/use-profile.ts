"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProfileRow } from "@/types/database";

interface UseProfileReturn {
  profile: ProfileRow | null;
  loading: boolean;
  error: string | null;
  update: (data: Record<string, unknown>) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/profile");

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const update = useCallback(async (data: Record<string, unknown>): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to update profile");
      }

      const updated = await res.json();
      setProfile(updated);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, []);

  return { profile, loading, error, update, refresh: fetchProfile };
}
