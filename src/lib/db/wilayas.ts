import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";
import type { WilayaRow } from "@/types/database";

export async function getAllWilayas(): Promise<WilayaRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("wilayas")
    .select("*")
    .order("code", { ascending: true });
  return data ?? [];
}

export async function getWilayaByCode(code: number): Promise<WilayaRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("wilayas")
    .select("*")
    .eq("code", code)
    .single();
  return data;
}
