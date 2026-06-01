import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checks = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      geminiKey1: !!process.env.GEMINI_API_KEY_1,
      geminiKey2: !!process.env.GEMINI_API_KEY_2,
      geminiKey3: !!process.env.GEMINI_API_KEY_3,
      geminiKey4: !!process.env.GEMINI_API_KEY_4,
      geminiKey5: !!process.env.GEMINI_API_KEY_5,
      geminiKey6: !!process.env.GEMINI_API_KEY_6,
      geminiKey7: !!process.env.GEMINI_API_KEY_7,
      nextRuntime: process.env.NEXT_RUNTIME,
    };
    const missing = Object.entries(checks).filter(([, v]) => !v && !v === undefined).map(([k]) => k);
    return NextResponse.json({ status: "ok", checks, missing });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 200 });
  }
}
