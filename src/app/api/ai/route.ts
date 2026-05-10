import { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/skills/system-prompt-builder";
import {
    detectSkillContext,
    detectLanguage,
} from "@/lib/skills/skill-trigger-detector";

async function buildGeminiMessages(messages: any[]) {
    const result = [];

    for (const m of messages) {
        const role = m.role === "assistant" ? "model" : "user";
        const content = m.content || "";

        result.push({
            role,
            parts: [{ text: content }],
        });
    }

    return result;
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { messages, profile } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json(
                { error: "messages required" },
                { status: 400 }
            );
        }

        const lastMessage =
            messages[messages.length - 1]?.content || "";

        const language = detectLanguage(lastMessage);
        const context = detectSkillContext(lastMessage);

        const agentProfile = {
            full_name: profile?.full_name || "Agent",
            wilaya: profile?.wilaya || "Algérie",
            specializations: profile?.specializations?.length
                ? profile.specializations
                : ["agriculture générale"],
            language_pref: profile?.language_pref || "fr",
        };

        const systemPrompt = buildSystemPrompt(
            agentProfile,
            context,
            language
        );

        const geminiMessages =
            await buildGeminiMessages(messages);

        const geminiBody = {
            system_instruction: {
                parts: [{ text: systemPrompt }],
            },
            contents: geminiMessages,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192,
            },
        };

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(geminiBody),
            }
        );

        if (!geminiRes.ok) {
            const err = await geminiRes.text();

            return Response.json(
                { error: err },
                { status: 502 }
            );
        }

        return new Response(geminiRes.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
            },
        });
    } catch (err: any) {
        return Response.json(
            { error: err.message },
            { status: 500 }
        );
    }
}