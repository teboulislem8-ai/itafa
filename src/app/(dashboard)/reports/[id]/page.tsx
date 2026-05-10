"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getAiWorkerUrl } from "@/lib/utils/config";
import { Button } from "@/components/ui";

interface ReportData {
  id: string;
  session_id: string;
  language: string;
  content: string;
  format: string;
  created_at: string;
}

interface SessionData {
  id: string;
  title: string;
  crop: string;
  created_at: string;
}

interface MessageData {
  role: string;
  content: string;
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      supabase.from("sessions").select("*").eq("id", id).single().then(({ data }) => setSession(data as SessionData));
      supabase.from("field_reports").select("*").eq("session_id", id).maybeSingle().then(({ data }) => setReport(data as ReportData));
      supabase.from("messages").select("*").eq("session_id", id).order("created_at", { ascending: true }).then(({ data }) => setMessages(data ?? []));
    });
  }, [id]);

  async function generateReport() {
    setGenerating(true);

    const transcript = messages
      .map((m) => `${m.role === "user" ? "Agent" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const aiPayload = {
      messages: [
        {
          role: "user",
          content: `Génère un rapport de terrain professionnel à partir de cette session de diagnostic agricole.\n\n${transcript}`,
        },
      ],
    };

    try {
      const res = await fetch(`${getAiWorkerUrl()}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPayload),
      });

      if (res.ok) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let full = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const json = JSON.parse(line.replace("data: ", "").trim());
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
              full += text;
            } catch {}
          }
        }

        const { data: newReport } = await supabase
          .from("field_reports")
          .insert({ session_id: id, content: full, language: "fr", format: "markdown" })
          .select()
          .single();

        if (newReport) {
          setReport(newReport as ReportData);
          await supabase.from("sessions").update({ status: "report_generated" }).eq("id", id);
        }
      }
    } catch {}

    setGenerating(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Rapport de terrain</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        {session?.title || "Session"} · {session?.crop && `${session.crop} · `}
        {session?.created_at && new Date(session.created_at).toLocaleDateString("fr-FR")}
      </p>

      {!report && !generating && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: 16 }}>Aucun rapport généré pour cette session.</p>
          <Button onClick={generateReport} disabled={messages.length === 0}>
            Générer le rapport
          </Button>
        </div>
      )}

      {generating && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20 }}>
          <p style={{ color: "#666" }}>Génération du rapport en cours...</p>
        </div>
      )}

      {report && (
        <div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 14, marginBottom: 16 }}>
            {report.content}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              const blob = new Blob([report.content], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `rapport-${id.slice(0, 8)}.md`;
              a.click();
            }}
          >
            Télécharger (.md)
          </Button>
        </div>
      )}
    </div>
  );
}
