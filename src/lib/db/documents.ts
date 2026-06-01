import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";
import type { GeneratedDocumentRow, GeneratedDocumentInsert } from "@/types/database";

export async function createDocumentRecord(input: GeneratedDocumentInsert): Promise<GeneratedDocumentRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("generated_documents")
    .insert(input)
    .select()
    .single();
  return data;
}

export async function getDocument(documentId: string): Promise<GeneratedDocumentRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("generated_documents")
    .select("*")
    .eq("id", documentId)
    .single();
  return data;
}

export async function getDocumentsByChat(chatId: string): Promise<GeneratedDocumentRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("generated_documents")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
