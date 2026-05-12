"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/utils/lang-context";
import { useConnection, useSlowConnection } from "@/lib/utils/connection";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, weekSessions: 0, lastCrop: "" });
  const router = useRouter();
  const { t, lang, toggleLang } = useLang();
  const connection = useConnection();
  const isSlow = useSlowConnection();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setLoading(false);

      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      Promise.all([
        supabase.from("sessions").select("id", { count: "exact", head: true }).eq("agent_id", session.user.id),
        supabase.from("sessions").select("id", { count: "exact", head: true }).eq("agent_id", session.user.id).gte("created_at", sevenDaysAgo),
        supabase.from("sessions").select("crop").eq("agent_id", session.user.id).neq("crop", "").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]).then(([total, week, last]) => {
        setStats({
          sessions: total.count ?? 0,
          weekSessions: week.count ?? 0,
          lastCrop: last.data?.crop ?? "—",
        });
      });
    });
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {connection === "offline" && <div className="offline-banner">{t("Mode hors ligne — données limitées", "وضع غير متصل — بيانات محدودة")}</div>}
      {isSlow && connection === "online" && <div className="slow-connection-banner">{t("Connexion lente — les photos seront compressées", "اتصال بطيء — سيتم ضغط الصور")}</div>}



      <main>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
          {t("Dashboard", "الرئيسية")}
        </h1>

        {stats.sessions === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <p style={{ color: "#9ca3af", marginBottom: 16 }}>
              {t("Aucune session pour le moment. Créez votre première session pour commencer le diagnostic.", "لا توجد جلسات بعد. أنشئ جلستك الأولى لبدء التشخيص.")}
            </p>
            <Link href="/sessions">
              <Button>{t("+ Nouvelle session", "+ جلسة جديدة")}</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: t("Total sessions", "إجمالي الجلسات"), value: stats.sessions },
                { label: t("Cette semaine", "هذا الأسبوع"), value: stats.weekSessions },
                { label: t("Dernière culture", "آخر محصول"), value: stats.lastCrop },
              ].map((s) => (
                <Card key={s.label}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/sessions">
                <Button size="lg">{t("+ Nouvelle session", "+ جلسة جديدة")}</Button>
              </Link>
              <Link href="/observe">
                <Button variant="secondary" size="lg">{t("Observation terrain", "ملاحظة حقلية")}</Button>
              </Link>
              <Link href="/lab">
                <Button variant="secondary" size="lg">{t("Analyse labo", "تحليل مخبري")}</Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
