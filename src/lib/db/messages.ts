import "server-only";
import { getServerClient } from "@/lib/supabase/proxy";
import type { MessageRow, MessageInsert } from "@/types/database";

export async function createMessage(input: MessageInsert): Promise<MessageRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("messages")
    .insert(input)
    .select()
    .single();
  return data;
}

export async function getMessagesByChat(chatId: string): Promise<MessageRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getMessage(messageId: string): Promise<MessageRow | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();
  return data;
}
