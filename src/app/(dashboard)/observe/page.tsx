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

// ── Leaf Vein SVG Animation ──────────────────────────────────────────────────
function LeafVeinLoader({ text }: { text: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      gap: 28,
    }}>
      <svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <style>{`
          @keyframes vein-glow {
            0%   { stroke-dashoffset: 1; opacity: 0.15; }
            50%  { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0.85; }
          }
          @keyframes leaf-pulse {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(27,107,58,0.25)); }
            50%       { filter: drop-shadow(0 0 18px rgba(27,107,58,0.55)); }
          }
          .leaf-body {
            animation: leaf-pulse 2.4s ease-in-out infinite;
          }
          .vein {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            pathLength: 1;
            animation: vein-glow 1.8s ease-in-out infinite alternate;
          }
          .vein-main  { animation-delay: 0s;    animation-duration: 1.8s; }
          .vein-l1    { animation-delay: 0.15s; animation-duration: 1.9s; }
          .vein-l2    { animation-delay: 0.30s; animation-duration: 2.0s; }
          .vein-l3    { animation-delay: 0.45s; animation-duration: 1.7s; }
          .vein-l4    { animation-delay: 0.60s; animation-duration: 2.1s; }
          .vein-r1    { animation-delay: 0.20s; animation-duration: 1.85s; }
          .vein-r2    { animation-delay: 0.35s; animation-duration: 2.05s; }
          .vein-r3    { animation-delay: 0.50s; animation-duration: 1.75s; }
          .vein-r4    { animation-delay: 0.65s; animation-duration: 1.95s; }
        `}</style>

        {/* Leaf body */}
        <g className="leaf-body">
          <path
            d="M60 130 C20 100 5 65 15 35 C25 10 50 4 60 4 C70 4 95 10 105 35 C115 65 100 100 60 130Z"
            fill="rgba(27,107,58,0.08)"
            stroke="rgba(27,107,58,0.35)"
            strokeWidth="1.5"
          />
        </g>

        {/* Main midrib */}
        <path
          className="vein vein-main"
          d="M60 128 C60 100 60 60 60 10"
          stroke="var(--brand, #1B6B3A)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
        />

        {/* Left lateral veins */}
        <path className="vein vein-l1" d="M59 100 C48 92 34 90 22 88" stroke="var(--brand, #1B6B3A)" strokeWidth="1.2" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-l2" d="M59 80  C46 70 32 68 18 64" stroke="var(--brand, #1B6B3A)" strokeWidth="1.2" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-l3" d="M59 60  C48 50 36 46 26 42" stroke="var(--brand, #1B6B3A)" strokeWidth="1.1" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-l4" d="M59 42  C50 34 42 30 36 26" stroke="var(--brand, #1B6B3A)" strokeWidth="1.0" strokeLinecap="round" pathLength="1" />

        {/* Right lateral veins */}
        <path className="vein vein-r1" d="M61 100 C72 92 86 90 98 88" stroke="var(--brand, #1B6B3A)" strokeWidth="1.2" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-r2" d="M61 80  C74 70 88 68 102 64" stroke="var(--brand, #1B6B3A)" strokeWidth="1.2" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-r3" d="M61 60  C72 50 84 46 94 42" stroke="var(--brand, #1B6B3A)" strokeWidth="1.1" strokeLinecap="round" pathLength="1" />
        <path className="vein vein-r4" d="M61 42  C70 34 78 30 84 26" stroke="var(--brand, #1B6B3A)" strokeWidth="1.0" strokeLinecap="round" pathLength="1" />
      </svg>

      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-display, 'DM Serif Display', serif)",
          fontSize: 18,
          color: "var(--brand, #1B6B3A)",
          marginBottom: 6,
          letterSpacing: "0.01em",
        }}>
          Analyse en cours…
        </p>
        <p style={{
          fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
          fontSize: 13,
          color: "var(--text-muted, #888)",
          letterSpacing: "0.03em",
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}

// ── Shared button styles ─────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  padding: "10px 26px",
  background: "var(--brand, #1B6B3A)",
  color: "var(--border-light)",
  border: "none",
  borderRadius: "var(--radius-sm, 6px)",
  cursor: "pointer",
  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: "0.04em",
  transition: "opacity 0.15s",
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 26px",
  background: "var(--bg-surface, #f8f6f1)",
  color: "var(--text-primary, #1a1a1a)",
  border: "1px solid var(--border, #d5cfc7)",
  borderRadius: "var(--radius-sm, 6px)",
  cursor: "pointer",
  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: "0.02em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
  borderRadius: "var(--radius-sm, 6px)",
  border: "1px solid var(--border, #d5cfc7)",
  background: "var(--bg-surface, #f8f6f1)",
  color: "var(--text-primary, #1a1a1a)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--text-muted, var(--text-muted))",
  marginBottom: 10,
};

// ── Main Page ────────────────────────────────────────────────────────────────
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
    setSymptoms((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
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
            } catch { }
          }
        }

        if (obs) {
          await supabase.from("observations").update({ ai_analysis: full }).eq("id", obs.id);
        }
      }
    } catch { }

    setSubmitting(false);
    setDone(true);
  }

  // ── Card shell shared by all states ───────────────────────────────────────
  const cardShell: React.CSSProperties = {
    maxWidth: 760,
    margin: "0 auto",
    background: "var(--bg-card, var(--border-light)fff)",
    border: "1px solid var(--border-light, #ece8e1)",
    borderRadius: "var(--radius-lg, 12px)",
    padding: 32,
    boxShadow: "0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
  };

  const pageTitle = (
    <h1 style={{
      fontFamily: "var(--font-display, 'DM Serif Display', serif)",
      fontSize: 34,
      fontWeight: 400,
      color: "var(--brand, #1B6B3A)",
      marginBottom: 28,
      lineHeight: 1.15,
    }}>
      Observation terrain
    </h1>
  );

  // ── Submitting state: leaf vein animation ──────────────────────────────────
  if (submitting) {
    return (
      <div style={cardShell}>
        {pageTitle}
        <LeafVeinLoader text="L'IA analyse vos données de terrain…" />
      </div>
    );
  }

  // ── Done state ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={cardShell}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', serif)",
            fontSize: 28,
            fontWeight: 400,
            color: "var(--brand, #1B6B3A)",
            margin: 0,
          }}>
            Observation enregistrée
          </h1>
        </div>
        <p style={{
          fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
          fontSize: 12,
          color: "var(--text-muted, #888)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          Session #{sessionId.slice(0, 8)}
        </p>

        <div style={{
          background: "var(--bg-surface, #f8f6f1)",
          border: "1px solid var(--border-light, #ece8e1)",
          borderRadius: "var(--radius-sm, 8px)",
          padding: "20px 24px",
          whiteSpace: "pre-wrap",
          lineHeight: 1.75,
          fontSize: 14,
          fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
          color: "var(--text-primary, #1a1a1a)",
        }}>
          {analysis || "Analyse en cours…"}
        </div>

        <a
          href={`/sessions/${sessionId}`}
          style={{
            display: "inline-block",
            marginTop: 20,
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.04em",
            color: "var(--brand, #1B6B3A)",
            textDecoration: "none",
          }}
        >
          Voir la session →
        </a>
      </div>
    );
  }

  // ── Step pills ─────────────────────────────────────────────────────────────
  const stepLabels = ["Culture", "Stade", "Symptômes", "Sol & Irrigation"];

  return (
    <div style={cardShell}>
      {pageTitle}

      {/* Step navigation pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
        {stepLabels.map((label, i) => (
          <span
            key={label}
            onClick={() => setStep(i)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
              fontWeight: step === i ? 600 : 400,
              letterSpacing: "0.04em",
              cursor: "pointer",
              background: step === i ? "var(--brand, #1B6B3A)" : "transparent",
              color: step === i ? "var(--border-light)" : "var(--text-muted, #888)",
              border: `1px solid ${step === i ? "var(--brand, #1B6B3A)" : "var(--border, #d5cfc7)"}`,
              transition: "all 0.15s",
            }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: "50%",
              fontSize: 10,
              fontWeight: 700,
              background: step === i ? "rgba(255,255,255,0.2)" : "var(--bg-surface, #f0ede8)",
              color: step === i ? "var(--border-light)" : "var(--text-muted, #888)",
            }}>
              {i + 1}
            </span>
            {label}
          </span>
        ))}
      </div>

      {/* ── Step 0: Culture ─────────────────────────────────────────────────── */}
      {step === 0 && (
        <div>
          <label style={labelStyle}>Culture observée</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="ex: Tomate, Blé dur, Poivron…"
            style={inputStyle}
          />
          <div style={{ marginTop: 20 }}>
            <button onClick={() => crop && setStep(1)} style={btnPrimary}>
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 1: Stade ───────────────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <label style={labelStyle}>Stade de développement</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GROWTH_STAGES.map((s) => (
              <label
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  border: `1px solid ${growthStage === s ? "var(--brand, #1B6B3A)" : "var(--border-light, #ece8e1)"}`,
                  borderRadius: "var(--radius-sm, 6px)",
                  cursor: "pointer",
                  background: growthStage === s ? "rgba(27,107,58,0.05)" : "var(--bg-surface, #f8f6f1)",
                  fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                  fontSize: 14,
                  color: "var(--text-primary, #1a1a1a)",
                  transition: "all 0.12s",
                }}
              >
                <input
                  type="radio"
                  name="stage"
                  checked={growthStage === s}
                  onChange={() => setGrowthStage(s)}
                  style={{ accentColor: "var(--brand, #1B6B3A)" }}
                />
                {s}
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(0)} style={btnSecondary}>← Retour</button>
            <button onClick={() => growthStage && setStep(2)} style={btnPrimary}>Suivant →</button>
          </div>
        </div>
      )}

      {/* ── Step 2: Symptômes ───────────────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <label style={labelStyle}>Symptômes observés</label>
          {SYMPTOM_CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11,
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted, #888)",
                marginBottom: 8,
              }}>
                {cat.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {cat.items.map((item) => {
                  const active = symptoms.includes(item);
                  return (
                    <span
                      key={item}
                      onClick={() => toggleSymptom(item)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                        cursor: "pointer",
                        border: `1px solid ${active ? "var(--brand, #1B6B3A)" : "var(--border, #d5cfc7)"}`,
                        background: active ? "var(--brand, #1B6B3A)" : "var(--bg-surface, #f8f6f1)",
                        color: active ? "var(--border-light)" : "var(--text-primary, #1a1a1a)",
                        fontWeight: active ? 600 : 400,
                        transition: "all 0.12s",
                        userSelect: "none",
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={btnSecondary}>← Retour</button>
            <button onClick={() => setStep(3)} style={btnPrimary}>Suivant →</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Sol & Irrigation ─────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Notes sur le sol</label>
            <textarea
              value={soilNotes}
              onChange={(e) => setSoilNotes(e.target.value)}
              placeholder="Type de sol, humidité, compaction…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Irrigation</label>
            <textarea
              value={irrigationNotes}
              onChange={(e) => setIrrigationNotes(e.target.value)}
              placeholder="Source, fréquence, méthode…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Summary preview */}
          {crop && (
            <div style={{
              background: "var(--bg-surface, #f8f6f1)",
              border: "1px solid var(--border-light, #ece8e1)",
              borderRadius: "var(--radius-sm, 6px)",
              padding: "14px 16px",
              marginBottom: 24,
              fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
              fontSize: 13,
              color: "var(--text-muted, var(--text-muted))",
              lineHeight: 1.7,
            }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary, #1a1a1a)" }}>{crop}</span>
              {growthStage && <> · {growthStage}</>}
              {symptoms.length > 0 && <> · {symptoms.length} symptôme{symptoms.length > 1 ? "s" : ""}</>}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={btnSecondary}>← Retour</button>
            <button
              onClick={submitObservation}
              disabled={!crop}
              style={{
                ...btnPrimary,
                opacity: !crop ? 0.5 : 1,
                cursor: !crop ? "not-allowed" : "pointer",
              }}
            >
              Soumettre l'observation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
