"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="ita-card login-mode" style={{height:"auto", minHeight:"220px", alignItems:"center", justifyContent:"center", gap:"12px", textAlign:"center"}}>
      <svg width="36" height="17" viewBox="370 567 760 366" xmlns="http://www.w3.org/2000/svg">
        <path fill="#34ab53" d="M749.4 922.8C544.9 922.3 379.6 749.4 379.6 749.4S545.7 577.2 750.5 577.4C955.2 577.6 1120.3 750.8 1120.3 750.8S954 923.3 749.4 922.8Z"/>
      </svg>
      <p style={{fontSize:"14px", fontWeight:600, color:"var(--text-primary)"}}>500 — Erreur serveur</p>
      <p style={{fontSize:"12px", color:"var(--text-muted)"}}>{error?.message || "Une erreur inattendue est survenue."}</p>
      <button className="ita-action-btn" style={{width:"auto", padding:"8px 20px"}} onClick={reset}>
        Réessayer
      </button>
    </div>
  );
}
