import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";
import type { UploadedFileRow, UploadedFileInsert } from "@/types/database";

export async function createFileRecord(input: UploadedFileInsert): Promise<UploadedFileRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("uploaded_files")
    .insert(input)
    .select()
    .single();
  return data;
}

export async function getFile(fileId: string): Promise<UploadedFileRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("id", fileId)
    .single();
  return data;
}

export async function getFilesByChat(chatId: string): Promise<UploadedFileRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
