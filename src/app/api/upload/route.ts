import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAcceptedMimeType } from "@/lib/utils";
import { createFileRecord } from "@/lib/db/files";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EXPIRY_HOURS = 48;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const chatId = formData.get("chatId") as string | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!isAcceptedMimeType(file.type)) {
    return NextResponse.json(
      { error: "File type not accepted" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }

  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  const record = await createFileRecord({
    user_id: user.id,
    chat_id: chatId || null,
    original_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    storage_path: storagePath,
    expires_at: expiresAt.toISOString(),
  });

  if (!record) {
    return NextResponse.json(
      { error: "Failed to create file record" },
      { status: 500 },
    );
  }

  return NextResponse.json(record, { status: 201 });
}
