import { NextRequest, NextResponse } from "next/server";
import { computeConfidence, shouldTriggerConfidence } from "@/lib/skills/confidence-scoring";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, diagnosisContext, userMessage, sessionId } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }

    if (!/^https:\/\/(.*\.supabase\.co|storage\.googleapis\.com)/.test(imageUrl)) {
      return NextResponse.json({ error: "invalid image origin" }, { status: 400 });
    }

    const triggerCheck = shouldTriggerConfidence(userMessage || "", true);
    if (!triggerCheck.trigger) {
      return NextResponse.json({
        agreementScore: 0,
        consistencyConfidence: 0,
        contradictionDetected: false,
        skipReason: triggerCheck.reason,
        imagePresent: true,
        triggeredBy: triggerCheck.reason,
      });
    }

    const result = await computeConfidence(imageUrl, diagnosisContext || "");

    if (sessionId) {
      try {
        await supabaseAdmin.from("confidence_logs").insert({
          session_id: sessionId,
          image_url: imageUrl,
          user_message: userMessage || "",
          pass_count: result.passDiagnoses.length,
          agreement_score: result.agreementScore,
          consistency_confidence: result.consistencyConfidence,
          contradiction_detected: result.contradictionDetected,
          pass_diagnoses: result.passDiagnoses,
          triggered_by: result.triggeredBy,
        });
      } catch {
        // logging is non-critical
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confidence scoring failed";
    console.error("Confidence API error:", message);
    return NextResponse.json({
      agreementScore: 0,
      consistencyConfidence: 0,
      contradictionDetected: false,
      error: message,
      imagePresent: true,
      triggeredBy: "error",
    });
  }
}
