"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTheme, toggleTheme, subscribe } from "@/lib/theme-store";

interface Props {
  profile: Record<string, unknown> | null;
  wilayas: Record<string, unknown>[];
  userEmail: string;
}

export function ITAProfileForm({ profile, wilayas, userEmail }: Props) {
  const router = useRouter();
  const [nickname, setNickname] = useState((profile?.nickname as string) ?? "");
  const [fullName, setFullName] = useState((profile?.full_name as string) ?? "");
  const [language, setLanguage] = useState((profile?.language as string) ?? "fr");
  const [wilayaCode, setWilayaCode] = useState((profile?.wilaya_code as string) ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => setMounted(true), []);
  useEffect(() => subscribe((t) => setTheme(t)), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname,
        full_name: fullName || null,
        language,
        wilaya_code: wilayaCode ? Number(wilayaCode) : undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      setMessage(body.error ?? "Échec de la mise à jour");
      return;
    }

    setMessage("Profil mis à jour");
    router.refresh();
  }

  const mt = mounted ? Math.max(30, (window.innerHeight - 520) / 2 - 40) : 30;

  return (
    <div className="ita-card profile-mode ita-morph-complete" style={{ marginTop: mt + "px" }}>
      <div className="ita-profile-content" style={{display:"block"}}>
        <div className="ita-page-hdr">
          <div className="ita-page-title">Mon profil</div>
        </div>

        <div className="ita-pcard">
          <div className="ita-phead">
            <div className="ita-pavatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="ita-pinfo">
              <div className="ita-pname">{nickname || "Utilisateur"}</div>
              <div className="ita-pemail">{userEmail}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ita-pf">
              <label className="ita-pfl">Surnom</label>
              <input className="ita-pfi" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
            </div>
            <div className="ita-pf">
              <label className="ita-pfl">Email</label>
              <input className="ita-pfi" type="email" value={userEmail} disabled />
            </div>
            <div className="ita-pfrow">
              <div className="ita-pf">
                <label className="ita-pfl">Langue</label>
                <select className="ita-pfi" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <div className="ita-pf">
                <label className="ita-pfl">Wilaya</label>
                <select className="ita-pfi" value={wilayaCode} onChange={(e) => setWilayaCode(e.target.value)}>
                  <option value="">-- Sélectionner --</option>
                  {wilayas.map((w: Record<string, unknown>) => (
                    <option key={w.code as string} value={w.code as string}>
                      {(w.name_fr || w.name_latin) as string} ({(w.name_ar || w.name_arabic) as string})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="ita-psave" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>

          {message && (
            <p style={{fontSize:"11px",marginTop:"8px",textAlign:"center",
              color: message.includes("mis à jour") ? "var(--brand)" : "#C83232"}}>
              {message}
            </p>
          )}
        </div>

        <div className="ita-pset">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Préférences</h4>
          {[
            {name:"Notifications push",desc:"Alerte quand un diagnostic est prêt",on:true},
            {name:"Mode sombre",desc:"Interface en thème sombre",on:theme === "dark", onClick: toggleTheme},
            {name:"Confirmation envoi",desc:"Confirmer avant d'envoyer",on:false},
          ].map((s) => (
            <div key={s.name} className="ita-psr">
              <div><div className="ita-psrn">{s.name}</div><div className="ita-psrd">{s.desc}</div></div>
              <button className={`ita-toggle ${s.on ? "on" : ""}`} onClick={(e) => { if (s.onClick) s.onClick(); else e.currentTarget.classList.toggle("on"); }} />
            </div>
          ))}
        </div>

        <div className="ita-pdz">
          <h4>Zone de danger</h4>
          <div className="ita-psr">
            <div><div className="ita-psrn">Supprimer mon compte</div><div className="ita-psrd">Action irréversible</div></div>
            <button className="ita-pdz-btn" onClick={() => { if (confirm("Confirmer la suppression?")) alert("Compte supprimé"); }}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
