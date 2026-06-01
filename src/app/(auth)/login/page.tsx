"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("demo@ita.agri");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("Email ou mot de passe incorrect");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="ita-card login-mode">
      <div className="ita-top-section">
        <div className="ita-logo-block">
          <svg className="ita-logo-svg" width="36" height="17" viewBox="370 567 760 366" xmlns="http://www.w3.org/2000/svg">
            <path fill="#34ab53" d="M749.4 922.8C544.9 922.3 379.6 749.4 379.6 749.4S545.7 577.2 750.5 577.4C955.2 577.6 1120.3 750.8 1120.3 750.8S954 923.3 749.4 922.8Z"/>
            <g transform="matrix(0.749992,-0.00354228,0.00354228,0.749992,315.877681,730.442485)">
              <path fill="none" stroke="#1a4a1e" strokeWidth="22" strokeLinecap="round" d="M0.6 26.1C349 10.6 708.2 10.6 1078.3 26.1"/>
            </g>
          </svg>
          <div className="ita-logo-name">ITA</div>
          <div className="ita-logo-sub">Field Assistant</div>
        </div>
      </div>

      <div className="ita-mid-section">
        <div className="ita-morph-pair">
          <label className="ita-field-label">Email</label>
          <input
            className="ita-field-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="ita-compose-content">
            <div className="ita-compose-modes">
              <span className="ita-compose-spacer"></span>
              <div className="ita-info-pad">
                <span className="ita-weather-info">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  28°C
                </span>
                <span className="ita-location-info">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Blida, Algérie
                </span>
              </div>
              <span className="ita-conf-pad">
                <span className="ita-conf-label">Confiance</span>
                <span className="ita-conf-gauge">
                  <span className="ita-conf-track">
                    <span className="ita-conf-fill" style={{width:"82%"}}></span>
                  </span>
                  <span className="ita-conf-pct">82%</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="ita-pass-field">
          <label className="ita-field-label">Mot de passe</label>
          <input
            className="ita-field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
          />
        </div>

        <div className="ita-action-wrap">
          <button className="ita-action-btn" onClick={handleSignIn} disabled={loading}>
            <span className="ita-btn-label">{loading ? "Connexion..." : "Se connecter"}</span>
            <span className="ita-btn-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9l14-7-7 14-2-5-5-2z" fill="currentColor"/></svg>
            </span>
          </button>
        </div>
      </div>

      <div className="ita-bot-section">
        <div className="ita-auth-footer">
          Pas encore de compte? <a href="/register">Créer un compte</a>
        </div>
      </div>

      {error && (
        <p style={{fontSize:"11px", color:"#C83232", textAlign:"center", marginTop:"8px"}}>{error}</p>
      )}
    </div>
  );
}
