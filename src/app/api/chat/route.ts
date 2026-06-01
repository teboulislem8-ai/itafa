import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendMessageSchema } from "@/lib/validations/chat";
import { createChat, getChat } from "@/lib/db/chat";
import { createMessage, getMessagesByChat } from "@/lib/db/messages";
import { runPipeline, enrichContext } from "@/lib/ai/pipeline";
import { classifyMessage } from "@/lib/ai/classifier";
import { selectSkills } from "@/lib/ai/skills/skill-map";
import { ensureProfile } from "@/lib/db/profile";
import { WILAYA_COORDS } from "@/data/wilaya-coords";
import { parseNextSteps } from "@/lib/ai/next-steps";
import { getFilesByChat } from "@/lib/db/files";
import { getDocumentsByChat } from "@/lib/db/documents";
import { processAttachments } from "@/lib/ai/attachments";
import type { AttachmentInput } from "@/lib/ai/attachments";
import { detectLanguage } from "@/lib/lang/detect";
import type { NextStep } from "@/types/ai";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const list = searchParams.get("list");
  const chatId = searchParams.get("chatId");

  if (list === "true") {
    const { data } = await supabase
      .from("chats")
      .select("id, mode, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    return NextResponse.json({ chats: data ?? [] });
  }

  if (chatId) {
    const { data: chat } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const { data: rawMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    const messages = (rawMessages ?? []).map((m) => {
      if (m.role === "assistant") {
        const { cleaned } = parseNextSteps(m.content);
        return { ...m, content: cleaned };
      }
      return m;
    });

    let weather = null;
    let location: string | null = null;
    let confidence = null;
    let nextSteps: NextStep[] = [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("wilaya_code")
      .eq("id", user.id)
      .single();

    if (profile?.wilaya_code) {
      const coords = WILAYA_COORDS[profile.wilaya_code];
      if (coords) {
        const ctx = await enrichContext(coords.lat, coords.lon);
        weather = ctx.weather ?? null;
        location = `${coords.nameFr}, Algérie`;
      }
    }

    const lastAssistant = (messages ?? []).filter((m) => m.role === "assistant").pop();
    if (lastAssistant?.confidence) confidence = lastAssistant.confidence;

    const lastRaw = (rawMessages ?? []).filter((m) => m.role === "assistant").pop();
    if (lastRaw) {
      const { nextSteps: parsed } = parseNextSteps(lastRaw.content);
      nextSteps = parsed;
    }

    const rawFiles = await getFilesByChat(chatId);
    const files = rawFiles.map((f) => ({
      ...f,
      publicUrl: supabase.storage.from("uploads").getPublicUrl(f.storage_path).data.publicUrl,
    }));

    const documents = await getDocumentsByChat(chatId);

    return NextResponse.json({ chat, messages, weather, location, confidence, nextSteps, files, documents });
  }

  return NextResponse.json({ error: "Invalid query" }, { status: 400 });
}

export async function POST(request: Request) {
  try {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = sendMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { content, mode, attachments } = parsed.data;

  await ensureProfile(user.id);

  let chatId = parsed.data.chatId;

  let isNewChat = false;

  if (!chatId) {
    const chat = await createChat({ user_id: user.id, mode });
    if (!chat) {
      return NextResponse.json(
        { error: "Failed to create chat" },
        { status: 500 },
      );
    }
    chatId = chat.id;
    isNewChat = true;
  }

  if (isNewChat) {
    await supabase
      .from("uploaded_files")
      .update({ chat_id: chatId })
      .eq("user_id", user.id)
      .is("chat_id", null);
  }

  const userMessage = await createMessage({
    chat_id: chatId,
    role: "user",
    content,
  });

  if (!userMessage) {
    return NextResponse.json(
      { error: "Failed to store message" },
      { status: 500 },
    );
  }

  const classifierResult = await classifyMessage(content);
  const skills = selectSkills({ mode, content });

  const { data: profile } = await supabase
    .from("profiles")
    .select("wilaya_code")
    .eq("id", user.id)
    .single();

  let lat: number | undefined;
  let lon: number | undefined;
  let location: string | undefined;

  if (profile?.wilaya_code) {
    const { data: wilaya } = await supabase
      .from("wilayas")
      .select("latitude, longitude, name_fr, name_en")
      .eq("code", profile.wilaya_code)
      .single();
    if (wilaya) {
      lat = wilaya.latitude;
      lon = wilaya.longitude;
      location = `${wilaya.name_fr}, Algérie`;
    } else {
      const coords = WILAYA_COORDS[profile.wilaya_code];
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        location = `${coords.nameFr}, Algérie`;
      }
    }
  }

  const context = await enrichContext(lat, lon);
  const messageHistory = await getMessagesByChat(chatId);

  const uploadedFiles = await getFilesByChat(chatId);
  const attachmentInputs: AttachmentInput[] = uploadedFiles.map((f) => ({
    id: f.id,
    mimeType: f.mime_type,
    storagePath: f.storage_path,
  }));
  const processedAttachments = await processAttachments(attachmentInputs);

  const detectedLang = detectLanguage(content);

  const output = await runPipeline({
    chatId,
    messageId: userMessage.id,
    content,
    mode,
    skills,
    context,
    language: detectedLang,
    messageHistory: messageHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    attachments: processedAttachments,
  });

  const { cleaned: cleanContent } = parseNextSteps(output.response);

  const assistantMessage = await createMessage({
    chat_id: chatId,
    role: "assistant",
    content: output.response,
    skills_used: output.skillsUsed,
    confidence: output.confidence,
    classifier_result: output.classifierResult,
  });

  if (!assistantMessage) {
    return NextResponse.json(
      { error: "Failed to store assistant message" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    chatId,
    messageId: assistantMessage.id,
    content: cleanContent,
    confidence: output.confidence,
    skillsUsed: output.skillsUsed,
    weather: context.weather ?? null,
    location: location ?? null,
    nextSteps: output.nextSteps,
  });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
