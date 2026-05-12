"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useLang } from "@/lib/utils/lang-context";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import type { Session } from "@/lib/utils/db-types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, lang } = useLang();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("sessions")
        .select("*")
        .eq("agent_id", user.id)
        .order("updated_at", { ascending: false })
        .then(({ data, error: err }) => {
          if (err) setError(t("Erreur de chargement.", "خطأ في التحميل."));
          else setSessions((data ?? []) as Session[]);
          setLoading(false);
        });
    });
  }, [t]);

  async function createSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("wilaya").eq("id", user.id).single();
    const { data } = await supabase
      .from("sessions")
      .insert({ agent_id: user.id, title: t("Nouvelle session", "جلسة جديدة"), wilaya: profile?.wilaya ?? "" })
      .select()
      .single();
    if (data) window.location.href = `/sessions/${data.id}`;
  }

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 32, width: 180, marginBottom: 24 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("Sessions", "الجلسات")}</h1>
        <Button onClick={createSession}>{t("+ Nouvelle session", "+ جلسة جديدة")}</Button>
      </div>

      {error && <div className="error-state">{error}</div>}

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>
            {t("Aucune session pour le moment. Créez-en une pour commencer.", "لا توجد جلسات بعد. أنشئ واحدة للبدء.")}
          </p>
          <Button onClick={createSession}>{t("Créer une session", "إنشاء جلسة")}</Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sessions.map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.title || t("Sans titre", "بلا عنوان")}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                    {s.crop && `${s.crop} · `}{s.wilaya && `${s.wilaya} · `}
                    {new Date(s.updated_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                  </div>
                </div>
                <span style={{
                  fontSize: 12, padding: "2px 8px", borderRadius: 4,
                  background: s.status === "open" ? "#dbeafe" : s.status === "closed" ? "#d1fae5" : "#fef3c7",
                  color: s.status === "open" ? "#1e40af" : s.status === "closed" ? "#065f46" : "#92400e",
                }}>
                  {s.status === "open" ? t("Ouverte", "مفتوحة") : s.status === "closed" ? t("Fermée", "مغلقة") : t("Rapport", "تقرير")}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


