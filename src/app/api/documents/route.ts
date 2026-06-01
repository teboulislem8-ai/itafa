import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMessagesByChat } from "@/lib/db/messages";
import { getChat } from "@/lib/db/chat";
import { createDocumentRecord } from "@/lib/db/documents";
import type { DocumentType } from "@/types/database";

interface GenerateRequest {
  chatId: string;
  type: DocumentType;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as GenerateRequest;
  const { chatId, type } = body;

  if (!chatId || !type) {
    return NextResponse.json(
      { error: "chatId and type are required" },
      { status: 400 },
    );
  }

  if (!["session_report", "prescription", "observation_sheet"].includes(type)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  const chat = await getChat(chatId);

  if (!chat || chat.user_id !== user.id) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const messages = await getMessagesByChat(chatId);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "No messages to generate document from" },
      { status: 400 },
    );
  }

  // Call the document generator Worker via Service Binding
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = getCloudflareContext().env as any;
    const genResponse = await env.DOCUMENT_GENERATOR.fetch("http://internal/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, type, messages, user }),
    });

    if (!genResponse.ok) {
      const err = await genResponse.text();
      return NextResponse.json(
        { error: `Document generation failed: ${err}` },
        { status: 500 },
      );
    }

    const result = (await genResponse.json()) as { storagePath: string };

    const record = await createDocumentRecord({
      user_id: user.id,
      chat_id: chatId,
      type,
      storage_path: result.storagePath,
    });

    if (!record) {
      return NextResponse.json(
        { error: "Failed to store document record" },
        { status: 500 },
      );
    }

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Document generator unavailable" },
      { status: 503 },
    );
  }
}
