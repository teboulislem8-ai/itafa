import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";

export async function ensureProfile(userId: string) {
  const supabase = await getServerClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  await supabase.from("profiles").insert({
    id: userId,
    nickname: `user_${userId.slice(0, 8)}`,
    wilaya_code: 16,
    specialization: "",
    language: "fr",
  });
}

export async function getProfile(userId: string) {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return data;
}
