import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";
import type { ChatRow, ChatInsert, ChatUpdate } from "@/types/database";

export async function createChat(input: ChatInsert): Promise<ChatRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("chats")
    .insert(input)
    .select()
    .single();
  return data;
}

export async function getChat(chatId: string): Promise<ChatRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();
  return data;
}

export async function listChats(userId: string) {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("chats")
    .select(`
      id,
      mode,
      title,
      created_at
    `)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function updateChat(chatId: string, updates: ChatUpdate): Promise<ChatRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("chats")
    .update(updates)
    .eq("id", chatId)
    .select()
    .single();
  return data;
}

export async function deleteChat(chatId: string): Promise<void> {
  const supabase = await getServerClient();
  await supabase.from("chats").delete().eq("id", chatId);
}
