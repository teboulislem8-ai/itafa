"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardContent } from "@/components/ui";
import type { ProfileRow, WilayaRow } from "@/types/database";

interface ProfileFormProps {
  profile: ProfileRow | null;
  wilayas: WilayaRow[];
  userEmail: string;
}

export function ProfileForm({ profile, wilayas, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [language, setLanguage] = useState(profile?.language ?? "fr");
  const [wilayaCode, setWilayaCode] = useState(profile?.wilaya_code ?? 16);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname,
        language,
        wilaya_code: wilayaCode || 16,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      setMessage(body.error ?? "Failed to update profile");
      return;
    }

    setMessage("Profile updated successfully");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            value={userEmail}
            disabled
          />
          <Input
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "fr" | "ar" | "en")}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Wilaya</label>
            <select
              value={wilayaCode}
              onChange={(e) => setWilayaCode(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name_fr} ({w.name_ar})
                </option>
              ))}
            </select>
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.includes("successfully") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
