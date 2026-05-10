"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getAiWorkerUrl } from "@/lib/utils/config";


const GROWTH_STAGES = [
  "Semis / Stade végétatif précoce",
  "Tallage / Rameification",
  "Montaison / Croissance",
  "Floraison",
  "Nouaison / Formation des fruits",
  "Maturation / Récolte",
];

const SYMPTOM_CATEGORIES = [
  {
    label: "Feuilles",
    items: ["Jaunissement (chlorose)", "Nécrose / Brûlure", "Taches", "Déformation", "Flétrissement", "Enroulement"],
  },
  {
    label: "Tige / Racines",
    items: ["Pourriture", "Lésions / Chancres", "Flétrissement vasculaire", "Galles racinaires"],
  },
  {
    label: "Fruits / Grains",
    items: ["Taches", "Pourriture", "Déformation", "Chute prématurée"],
  },
  {
    label: "Général",
    items: ["Retard de croissance", "Dépérissement progressif", "Attaque d'insectes visible", "Présence de moisissure"],
  },
];

export default function ObservePage() {
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [soilNotes, setSoilNotes] = useState("");
  const [irrigationNotes, setIrrigationNotes] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [analysis, setAnalysis] = useState("");

  function toggleSymptom(item: string) {
    setSymptoms((prev) => (prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]));
  }

  async function submitObservation() {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: session } = await supabase
      .from("sessions")
      .insert({ agent_id: user.id, title: `Observation: ${crop}`, crop, status: "open" })
      .select()
      .single();

    if (!session) return;
    setSessionId(session.id);

    const payload = {
      session_id: session.id,
      crop,
      growth_stage: growthStage,
      symptoms: { selected: symptoms },
      soil_notes: soilNotes,
      irrigation_notes: irrigationNotes,
    };

    const { data: obs } = await supabase.from("observations").insert(payload).select().single();

    const aiPayload = {
      messages: [
        {
          role: "user",
          content: `Observation terrain - Culture: ${crop}, Stade: ${growthStage}, Symptômes: ${symptoms.join(", ") || "non spécifiés"}. Sol: ${soilNotes || "non spécifié"}. Irrigation: ${irrigationNotes || "non spécifiée"}.`,
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

        if (obs) {
          await supabase.from("observations").update({ ai_analysis: full }).eq("id", obs.id);
        }
      }
    } catch {}

    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Observation enregistrée</h1>
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
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Observation terrain</h1>

      <div style={{ marginBottom: 24 }}>
        {["Culture", "Stade", "Symptômes", "Sol & Irrigation"].map((label, i) => (
          <span
            key={label}
            onClick={() => setStep(i)}
            style={{ display: "inline-block", padding: "6px 14px", marginRight: 8, marginBottom: 8, borderRadius: 20, fontSize: 13, cursor: "pointer", background: step === i ? "#1B6B3A" : "#e5e7eb", color: step === i ? "#fff" : "#333" }}
          >
            {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Culture observée</label>
          <input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="ex: Tomate, Blé dur, Poivron..." style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }} />
          <button onClick={() => crop && setStep(1)} style={{ marginTop: 16, padding: "10px 24px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            Suivant →
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Stade de développement</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GROWTH_STAGES.map((s) => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", background: growthStage === s ? "#f0fdf4" : "#fff" }}>
                <input type="radio" name="stage" checked={growthStage === s} onChange={() => setGrowthStage(s)} />
                {s}
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => setStep(0)} style={{ padding: "10px 24px", background: "#fff", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}>← Retour</button>
            <button onClick={() => growthStage && setStep(2)} style={{ padding: "10px 24px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Suivant →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Symptômes observés</label>
          {SYMPTOM_CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 6 }}>{cat.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cat.items.map((item) => (
                  <span
                    key={item}
                    onClick={() => toggleSymptom(item)}
                    style={{ padding: "6px 12px", borderRadius: 20, fontSize: 13, cursor: "pointer", background: symptoms.includes(item) ? "#1B6B3A" : "#e5e7eb", color: symptoms.includes(item) ? "#fff" : "#333" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => setStep(1)} style={{ padding: "10px 24px", background: "#fff", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}>← Retour</button>
            <button onClick={() => setStep(3)} style={{ padding: "10px 24px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Suivant →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Notes sur le sol</label>
            <textarea value={soilNotes} onChange={(e) => setSoilNotes(e.target.value)} placeholder="Type de sol, humidité, compaction..." rows={3} style={{ width: "100%", padding: 10, fontSize: 14, borderRadius: 6, border: "1px solid #ccc", resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Irrigation</label>
            <textarea value={irrigationNotes} onChange={(e) => setIrrigationNotes(e.target.value)} placeholder="Source, fréquence, méthode..." rows={3} style={{ width: "100%", padding: 10, fontSize: 14, borderRadius: 6, border: "1px solid #ccc", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ padding: "10px 24px", background: "#fff", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}>← Retour</button>
            <button onClick={submitObservation} disabled={submitting || !crop} style={{ padding: "10px 24px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              {submitting ? "Analyse en cours..." : "Soumettre l'observation →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
