import { buildSystemPrompt } from "../src/lib/skills/system-prompt-builder";
import { detectSkillContext, detectLanguage } from "../src/lib/skills/skill-trigger-detector";

async function buildGeminiMessages(messages: any[]) {
  const result = [];
  for (const m of messages) {
    const role = m.role === "assistant" ? "model" : "user";
    const content = m.content || "";
    const urlMatch = content.match(/\[Photo: ([^\]]+)\]/);

    if (urlMatch) {
      const src = urlMatch[1];
      const text = content.replace(urlMatch[0], "").trim();

      if (src.startsWith("data:")) {
        const [meta, data] = src.split(",");
        const mimeType = meta.replace("data:", "").replace(";base64", "");
        const parts: any[] = [{ inline_data: { mime_type: mimeType, data } }];
        if (text) parts.push({ text });
        result.push({ role, parts });
      } else {
        try {
          const imgRes = await fetch(src);
          const imgBuffer = await imgRes.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(imgBuffer)));
          const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
          const parts: any[] = [{ inline_data: { mime_type: mimeType, data: base64 } }];
          if (text) parts.push({ text });
          result.push({ role, parts });
        } catch {
          result.push({ role, parts: [{ text: content }] });
        }
      }
    } else {
      result.push({ role, parts: [{ text: content }] });
    }
  }
  return result;
}

export default {
  async fetch(request: Request, env: any) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/api/ai") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body: any = await request.json();
      const { messages, profile } = body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: "messages required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const lastMessage = messages[messages.length - 1].content || "";
      const language = detectLanguage(lastMessage);
      const context = detectSkillContext(lastMessage);


      const agentProfile = {
        full_name: profile?.full_name || "Agent",
        wilaya: profile?.wilaya || "Algérie",
        specializations: profile?.specializations?.length
          ? profile.specializations
          : ["agriculture générale"],
        language_pref: profile?.language_pref || "fr"
      };

      const systemPrompt = buildSystemPrompt(agentProfile, context, language);
      const geminiMessages = await buildGeminiMessages(messages);

      const geminiBody = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      };

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${env.GEMINI_API_KEY}&alt=sse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        }
      );

      if (!geminiRes.ok) {
        const err = await geminiRes.text();
        return new Response(JSON.stringify({ error: err }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(geminiRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Skill-Context": context,
          "X-Language": language,
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
