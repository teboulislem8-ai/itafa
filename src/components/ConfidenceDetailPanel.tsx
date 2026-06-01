"use client";

import { useEffect, useState } from "react";
import type { ConfidenceData } from "@/types/database";

export function ConfidenceDetailPanel({
  confidence,
}: {
  confidence: ConfidenceData;
}) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setPct(confidence.score), 80);
    return () => clearTimeout(timer);
  }, [confidence.score]);

  const circ = 2 * Math.PI * 28;
  const offset = circ - (circ * pct / 100);
  const level = pct >= 80 ? "Élevée" : pct >= 60 ? "Moyenne" : "Faible";
  const showHint = pct < 80;

  return (
    <div className="ita-detail-panel">
      <div className="ita-dp-hdr">
        <div className="ita-dp-hdr-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
        </div>
        <div>
          <div className="ita-dp-title">Confiance diagnostique</div>
          <div className="ita-dp-sub">Niveau {level}</div>
        </div>
      </div>

      <div className="ita-dp-ring-wrap">
        <div className="ita-dp-ring">
          <svg viewBox="0 0 68 68">
            <circle className="bg" cx="34" cy="34" r="28" />
            <circle className="fg" cx="34" cy="34" r="28" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
          </svg>
          <span className="ita-dp-ring-pct">{pct}%</span>
        </div>
        <div className="ita-dp-ring-info">
          <div className="ita-dp-ring-label">{level}</div>
          <div className="ita-dp-ring-sub">Vérifié en {confidence.passes} passage{confidence.passes > 1 ? "s" : ""}</div>
        </div>
      </div>

      <div className="ita-dp-reason">
        <div className="ita-dp-reason-label">Analyse</div>
        <div className="ita-dp-reason-text">{confidence.reasoning}</div>
      </div>

      {showHint && (
        <div className="ita-dp-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>Ajoutez des observations détaillées ou des analyses pour améliorer la confiance du diagnostic.</span>
        </div>
      )}
    </div>
  );
}
