import { createClient } from "@/lib/supabase/server";
import { getAllWilayas } from "@/lib/db/wilayas";
import { ITAProfileForm } from "@/components/ITAProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const wilayas = await getAllWilayas();

  return (
    <ITAProfileForm
      profile={profile as unknown as Record<string, unknown> ?? null}
      wilayas={wilayas as unknown as Record<string, unknown>[]}
      userEmail={user!.email ?? ""}
    />
  );
}
