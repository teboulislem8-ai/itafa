"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compress";
import { getAiWorkerUrl } from "@/lib/utils/config";
import { useLang } from "@/lib/utils/lang-context";
import { useConnection } from "@/lib/utils/connection";
import type { Message, Profile, Session } from "@/lib/utils/db-types";
import type { ConfidenceResult } from "@/lib/skills/confidence-scoring";

export default function SessionChatPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confidenceResult, setConfidenceResult] = useState<ConfidenceResult | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { t, lang } = useLang();
  const connection = useConnection();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) setProfile(data as Profile);
      });

      supabase.from("sessions").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setSession(data as Session);
      });

      supabase
        .from("messages")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (data) setMessages(data as Message[]);
        });
    });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(t("L'image dépasse 5 Mo. Compressez-la ou choisissez-en une plus petite.", "الصورة تتجاوز 5 ميغابايت. قم بضغطها أو اختر صورة أصغر."));
      return;
    }

    setUploading(true);
    setError("");

    try {
      const compressed = await compressImage(file, 1024, 0.7);
      setImageBlob(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      const reader = new FileReader();
      reader.onload = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch {
      setError(t("Échec de la compression de l'image.", "فشل ضغط الصورة."));
    } finally {
      setUploading(false);
    }
  }

  async function send() {
    if ((!input.trim() && !imageBlob) || loading) return;

    setLoading(true);
    setError("");
    setConfidenceResult(null);

    let imageUrl = "";

    if (imageBlob) {
      const form = new FormData();
      form.append("file", imageBlob, `photo-${Date.now()}.jpg`);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");
        const data = (await res.json()) as { url?: string };
        if (data.url) imageUrl = data.url;
      } catch {
        setError(t("Erreur lors du téléchargement de la photo.", "خطأ في رفع الصورة."));
        setLoading(false);
        return;
      }
    }

    const userMsgContent = input || "📷 Photo envoyée";
    const { error: msgErr } = await supabase.from("messages").insert({
      session_id: id,
      role: "user",
      content: imageBase64 ? `${userMsgContent}\n[Photo: ${imageBase64}]` : userMsgContent,
    });

    if (msgErr) {
      setError(t("Erreur d'envoi du message.", "خطأ في إرسال الرسالة."));
      setLoading(false);
      return;
    }

    const { data: newMsg } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const updatedMessages = [...messages, newMsg as Message];
    setMessages(updatedMessages);
    setInput("");
    setImagePreview(null);
    setImageBlob(null);
    setImageBase64(null);

    const lastUserMsg = input || "📷 Photo envoyée";

    if (imageUrl) {
      fetch("/api/confidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          diagnosisContext: lastUserMsg,
          userMessage: lastUserMsg,
          sessionId: id,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.skipReason) setConfidenceResult(data as ConfidenceResult);
        })
        .catch(() => { });
    }

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${getAiWorkerUrl()}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          profile: profile
            ? {
              full_name: profile.full_name,
              wilaya: profile.wilaya,
              specializations: profile.specializations,
              language_pref: profile.language_pref,
            }
            : undefined,
        }),
      });

      if (!res.ok) {
        setError(t("Erreur de connexion au service IA. Veuillez réessayer.", "خطأ في الاتصال بخدمة الذكاء الاصطناعي. حاول مرة أخرى."));
        setLoading(false);
        return;
      }

      const skillContext = res.headers.get("X-Skill-Context") || "";
      const responseLanguage = res.headers.get("X-Language") || "";

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let buffer = "";
      const tempId = `temp-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: tempId, session_id: id, role: "assistant", content: "", skill_triggered: "", language: "", created_at: new Date().toISOString() },
      ]);

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
            if (text) {
              full += text;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.id === tempId) {
                  copy[copy.length - 1] = { ...last, content: full };
                }
                return copy;
              });
            }
          } catch { }
        }
      }

      await supabase.from("messages").insert({
        session_id: id,
        role: "assistant",
        content: full,
        skill_triggered: skillContext,
        language: responseLanguage,
      });

      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.id === tempId) {
          copy[copy.length - 1] = { ...last, content: full, skill_triggered: skillContext, language: responseLanguage };
        }
        return copy;
      });

      if (session?.title === "Nouvelle session" || !session?.title) {
        const firstWords = userMsgContent.slice(0, 60);
        await supabase.from("sessions").update({ title: firstWords }).eq("id", id);
        setSession((prev) => (prev ? { ...prev, title: firstWords } : prev));
      }
    } catch {
      setError(t("Erreur de connexion au service IA. Veuillez réessayer.", "خطأ في الاتصال بخدمة الذكاء الاصطناعي. حاول مرة أخرى."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", maxWidth: 700, margin: "0 auto", width: "100%" }}>
      {connection === "offline" && <div className="offline-banner">{t("Mode hors ligne", "وضع غير متصل")}</div>}

      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{session?.title || t("Chargement...", "جارٍ التحميل...")}</h1>
        {session?.crop && <span style={{ fontSize: 13, color: "#666" }}>{session.crop}</span>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fff", marginBottom: 12 }}>
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            {t("Envoyez un message ou une photo pour commencer le diagnostic.", "أرسل رسالة أو صورة لبدء التشخيص.")}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={m.id || i} style={{ marginBottom: 12, textAlign: m.role === "user" ? "right" : "left" }}>
            {m.content.includes("[Photo:") && (
              <div style={{ marginBottom: 4 }}>
                <img
                  src={m.content.match(/\[Photo: ([^\]]+)\]/)?.[1] || ""}
                  alt="field photo"
                  style={{ maxWidth: 200, borderRadius: 8, display: "inline-block" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                background: m.role === "user" ? "#d1fae5" : "#f3f4f6",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                textAlign: "left",
                direction: "ltr",
              }}
            >
              {m.role === "assistant" ? (m.content || (loading && i === messages.length - 1 ? "..." : "")) : m.content.replace(/\[Photo: [^\]]+\]/g, "").trim() || "📷"}
            </span>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.content === "" && (
          <div style={{ color: "#999" }}>...</div>
        )}

        {confidenceResult && !confidenceResult.skipReason && (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa", fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#374151" }}>
              {t("Évaluation de la confiance diagnostique", "تقييم الثقة التشخيصية")}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 4 }}>
              <span>
                {t("CONFIANCE DIAGNOSTIQUE", "الثقة التشخيصية")} •{" "}
                <strong style={{ color: confidenceResult.consistencyConfidence >= 50 ? "#1B6B3A" : "#d97706" }}>
                  {confidenceResult.consistencyConfidence}%
                </strong>
              </span>
              <span>
                {t("ACCORD INTER-ANALYSES", "الاتفاق بين التحليلات")} •{" "}
                <strong>{confidenceResult.agreementScore}%</strong>
              </span>
            </div>
            {confidenceResult.contradictionDetected && (
              <div style={{ marginTop: 6, padding: "6px 10px", background: "#fef3c7", borderRadius: 6, color: "#92400e", fontSize: 12 }}>
                ⚠ {t("Hypothèses divergentes — données terrain supplémentaires recommandées.", "فرضيات متباينة — يوصى ببيانات حقلية إضافية.")}
              </div>
            )}
            {confidenceResult.consistencyConfidence < 50 && (
              <div style={{ marginTop: 6, padding: "6px 10px", background: "#fef2f2", borderRadius: 6, color: "#991b1b", fontSize: 12 }}>
                {t(
                  "Confiance insuffisante pour recommander une intervention. Veuillez ajouter : photo supplémentaire, vue de la plante entière, contexte irrigation / sol.",
                  "ثقة غير كافية للتوصية بتدخل. يرجى إضافة: صورة إضافية، منظر كامل للنبات، سياق الري / التربة."
                )}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <div className="error-state">{error}</div>}

      {imagePreview && (
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <img src={imagePreview} alt="preview" style={{ height: 60, borderRadius: 4 }} />
          <button onClick={() => { setImagePreview(null); setImageBlob(null); }} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: 16 }} aria-label="Remove photo">✕</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} style={{ display: "none" }} aria-label="Upload photo" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ padding: "8px 12px", cursor: "pointer" }}
          aria-label={t("Ajouter une photo", "إضافة صورة")}
        >
          {uploading ? "..." : "📷"}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("Décrivez le problème / صف المشكلة", "صف المشكلة / Décrivez le problème")}
          style={{ flex: 1, padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
          dir={lang === "ar" ? "rtl" : "ltr"}
          aria-label={t("Message", "الرسالة")}
        />
        <button
          onClick={send}
          disabled={loading || uploading}
          style={{ padding: "10px 20px", background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
          aria-label={t("Envoyer", "إرسال")}
        >
          {loading ? "..." : t("Envoyer", "إرسال")}
        </button>
      </div>
    </div>
  );
}
