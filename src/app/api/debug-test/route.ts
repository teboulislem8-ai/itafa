import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, string> = {};
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    results["supabase/server"] = "ok";
  } catch (e) {
    results["supabase/server"] = String(e);
  }

  try {
    const { sendMessageSchema } = await import("@/lib/validations/chat");
    results["validations/chat"] = "ok";
  } catch (e) {
    results["validations/chat"] = String(e);
  }

  try {
    const { createChat } = await import("@/lib/db/chat");
    results["db/chat"] = "ok";
  } catch (e) {
    results["db/chat"] = String(e);
  }

  try {
    const { runPipeline } = await import("@/lib/ai/pipeline");
    results["ai/pipeline"] = "ok";
  } catch (e) {
    results["ai/pipeline"] = String(e);
  }

  try {
    const { classifyMessage } = await import("@/lib/ai/classifier");
    results["ai/classifier"] = "ok";
  } catch (e) {
    results["ai/classifier"] = String(e);
  }

  try {
    const { detectLanguage } = await import("@/lib/lang/detect");
    results["lang/detect"] = "ok";
  } catch (e) {
    results["lang/detect"] = String(e);
  }

  try {
    const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
    results["@ai-sdk/google"] = "ok";
  } catch (e) {
    results["@ai-sdk/google"] = String(e);
  }

  return NextResponse.json(results);
}
