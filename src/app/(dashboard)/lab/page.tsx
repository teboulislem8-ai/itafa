"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getAiWorkerUrl } from "@/lib/utils/config";


type ParamField = { key: string; label: string; unit: string; placeholder: string };

const SOIL_FIELDS: ParamField[] = [
  { key: "pH", label: "pH", unit: "", placeholder: "7.2" },
  { key: "EC", label: "Conductivité électrique (CE)", unit: "dS/m", placeholder: "1.5" },
  { key: "OM", label: "Matière organique (MO)", unit: "%", placeholder: "2.1" },
  { key: "CaCO3", label: "Calcaire total (CaCO₃)", unit: "%", placeholder: "18" },
  { key: "Olsen_P", label: "Phosphore assimilable (Olsen P)", unit: "mg/kg", placeholder: "12" },
  { key: "K", label: "Potassium échangeable (K)", unit: "mg/kg", placeholder: "180" },
  { key: "N", label: "Azote total (N)", unit: "%", placeholder: "0.15" },
  { key: "SAR", label: "SAR", unit: "", placeholder: "4" },
  { key: "CEC", label: "CEC", unit: "meq/100g", placeholder: "15" },
];

const WATER_FIELDS: ParamField[] = [
  { key: "pH", label: "pH", unit: "", placeholder: "7.8" },
  { key: "EC", label: "Conductivité électrique (CE)", unit: "dS/m", placeholder: "2.1" },
  { key: "SAR", label: "SAR", unit: "", placeholder: "6" },
  { key: "Cl", label: "Chlorures (Cl⁻)", unit: "mg/L", placeholder: "250" },
  { key: "B", label: "Bore (B)", unit: "mg/L", placeholder: "0.5" },
  { key: "Na", label: "Sodium (Na)", unit: "mg/L", placeholder: "200" },
];

export default function LabPage() {
  const [type, setType] = useState<"soil" | "water">("soil");
  const [values, setValues] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const fields = type === "soil" ? SOIL_FIELDS : WATER_FIELDS;

  function setValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function submitLab() {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const parsed: Record<string, number> = {};
    for (const f of fields) {
      const v = parseFloat(values[f.key]);
      if (!isNaN(v)) parsed[f.key] = v;
    }

    const { data: session } = await supabase
      .from("sessions")
      .insert({ agent_id: user.id, title: `Analyse ${type === "soil" ? "sol" : "eau"}`, status: "open" })
      .select()
      .single();

    if (!session) return;
    setSessionId(session.id);

    await supabase.from("lab_reports").insert({
      session_id: session.id,
      report_type: type,
      raw_values: parsed,
    });

    const valuesText = fields.map((f) => `${f.label}: ${values[f.key] || "—"} ${f.unit}`).join("\n");

    const aiPayload = {
      messages: [
        {
          role: "user",
          content: `Analyse de ${type === "soil" ? "sol" : "eau"}:\n${valuesText}`,
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
              setAnalysis(full);
            } catch {}
          }
        }

        await supabase.from("lab_reports").update({ ai_interpretation: full }).eq("session_id", session.id);
      }
    } catch {}

    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Analyse enregistrée</h1>
        <p style={{ color: "#666", marginBottom: 16 }}>Session #{sessionId.slice(0, 8)}</p>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 14 }}>
          {analysis || "Analyse en cours..."}
        </div>
        <a href={`/sessions/${sessionId}`} style={{ display: "inline-block", marginTop: 16, color: "#1B6B3A", fontWeight: 600 }}>
          Voir la session →
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Interprétation laboratoire</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => { setType("soil"); setValues({}); }} style={{ padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: type === "soil" ? "#1B6B3A" : "#e5e7eb", color: type === "soil" ? "#fff" : "#333" }}>
          Analyse de sol
        </button>
        <button onClick={() => { setType("water"); setValues({}); }} style={{ padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: type === "water" ? "#1B6B3A" : "#e5e7eb", color: type === "water" ? "#fff" : "#333" }}>
          Analyse d&apos;eau
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {f.label} {f.unit && <span style={{ fontWeight: 400, color: "#666" }}>({f.unit})</span>}
            </label>
            <input
              type="number" step="any"
              value={values[f.key] ?? ""}
              onChange={(e) => setValue(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={submitLab}
        disabled={submitting}
        style={{ marginTop: 24, padding: "12px 24px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 16, width: "100%" }}
      >
        {submitting ? "Analyse en cours..." : "Interpréter →"}
      </button>
    </div>
  );
}
