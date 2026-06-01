"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, language: "fr" } },
    });

    setLoading(false);

    if (signUpError) {
      setError("Inscription échouée. Veuillez réessayer.");
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="ita-card login-mode" style={{height:"auto", minHeight:"340px"}}>
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

      <form onSubmit={handleSubmit}>
        <div className="ita-mid-section">
          <label className="ita-field-label">Surnom</label>
          <input className="ita-field-input" type="text" value={nickname}
            onChange={(e) => setNickname(e.target.value)} required
            style={{marginBottom:"10px"}} />

          <label className="ita-field-label">Email</label>
          <input className="ita-field-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={{marginBottom:"10px"}} />

          <label className="ita-field-label">Mot de passe</label>
          <input className="ita-field-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6}
            style={{marginBottom:"14px"}} />

          {error && <p style={{fontSize:"11px", color:"#C83232", marginBottom:"8px"}}>{error}</p>}

          <div className="ita-action-wrap" style={{maxHeight:"none", overflow:"visible"}}>
            <button type="submit" className="ita-action-btn" disabled={loading}>
              <span className="ita-btn-label">{loading ? "Inscription..." : "Créer un compte"}</span>
            </button>
          </div>
        </div>
      </form>

      <div className="ita-bot-section">
        <div className="ita-auth-footer">
          Déjà un compte? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
}
