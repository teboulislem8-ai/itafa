"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@/hooks/use-chat";
import { WeatherIcon } from "@/lib/weather-icons";
import { renderText } from "@/lib/render-text";
import type { ChatMode } from "@/types/database";
import { WeatherDetailPanel } from "@/components/WeatherDetailPanel";
import { ConfidenceDetailPanel } from "@/components/ConfidenceDetailPanel";
import { PeekStrip } from "@/components/PeekStrip";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const detailId = searchParams.get("id");

  if (view === "history") return <HistoryView />;
  if (view === "detail" && detailId) return <DetailView id={detailId} />;

  return <ComposeView />;
}

/* ═══════════════════════════════════════════════════════════
   COMPOSE VIEW
   ═══════════════════════════════════════════════════════════ */
function ComposeView() {
  const router = useRouter();
  const [mode, setMode] = useState<ChatMode>("plant");
  const [collapsed, setCollapsed] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [sendError, setSendError] = useState("");
  const [filepickerOpen, setFilepickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{type:"success"|"error";text:string} | null>(null);
  const [activePanel, setActivePanel] = useState<"weather" | "confidence" | null>(null);
  const [peekPanel, setPeekPanel] = useState<"weather" | "confidence" | null>(null);
  const [panelState, setPanelState] = useState<"closed" | "open" | "closing">("closed");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCloseTimer = () => { if (closeTimerRef.current !== null) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; } };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { messages, loading, sendMessage, weather, location, confidence, loadWeather } = useChat();

  const syncVeinsOrigin = useCallback(() => {
    const modes = document.querySelector(".ita-compose-modes") as HTMLElement;
    if (!modes) return;
    const active = modes.querySelector(".ita-mode-btn.active") as HTMLElement;
    const infoPad = modes.querySelector(".ita-info-pad") as HTMLElement;
    if (!active || !infoPad) return;
    const overlay = modes.querySelector(".ita-veins-overlay") as HTMLElement;
    if (overlay) {
      overlay.style.left = (active.offsetLeft + active.offsetWidth) + "px";
      overlay.style.width = (infoPad.offsetLeft - active.offsetLeft - active.offsetWidth) + "px";
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(syncVeinsOrigin);
  }, [mode, collapsed, syncVeinsOrigin]);

  useEffect(() => {
    window.addEventListener("resize", syncVeinsOrigin);
    return () => window.removeEventListener("resize", syncVeinsOrigin);
  }, [syncVeinsOrigin]);

  useEffect(() => { loadWeather(); }, [loadWeather]);

  function togglePanel(name: "weather" | "confidence") {
    if (panelState === "closed" || panelState === "closing") {
      clearCloseTimer();
      setActivePanel(name);
      setPeekPanel(null);
      setPanelState("open");
    } else if (activePanel === name) {
      clearCloseTimer();
      setPanelState("closing");
      closeTimerRef.current = setTimeout(() => {
        setPanelState("closed");
        setActivePanel(null);
        setPeekPanel(null);
      }, 350);
    } else {
      clearCloseTimer();
      if (window.innerWidth < 768) {
        setActivePanel(name);
        setPeekPanel(null);
      } else {
        setPeekPanel(activePanel);
        setActivePanel(name);
      }
    }
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  async function handleSendMessage() {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value.trim();
    if (!text || loading) return;

    setSendError("");
    setHasMessages(true);
    ta.value = "";
    ta.style.height = "36px";
    setThinking(true);

    try {
      const chatId = await sendMessage(text, mode);
      if (chatId) {
        router.push("/chat/" + chatId);
        return;
      }
      setSendError("Échec de l'envoi — vérifiez votre connexion");
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Erreur lors de l'envoi");
    }

    setThinking(false);
  }

  function toggleMode(m: ChatMode) {
    if (hasMessages) return;
    if (m === mode) {
      setCollapsed((c) => !c);
    } else {
      setMode(m);
      setCollapsed(true);
    }
    requestAnimationFrame(syncVeinsOrigin);
  }

  function toggleFilepicker() {
    setFilepickerOpen((p) => !p);
    setUploadMsg(null);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("chatId", "");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setUploadMsg({ type: "success", text: "Fichier ajouté" });
      window.dispatchEvent(new Event("ita-files-changed"));
      setTimeout(() => setFilepickerOpen(false), 800);
    } catch {
      setUploadMsg({ type: "error", text: "Échec de l'upload" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="ita-dp-container">
    <div className={`ita-card ${filepickerOpen ? "filepicker-mode" : "compose-mode"} ita-morph-complete ${thinking ? "ita-thinking" : ""}`}
          style={{ width: "100%" }}>
      <div className="ita-chat-area">
        <div className="ita-msg ita-msg-ai">
          Bonjour! Je suis votre assistant ITA. Comment puis-je vous aider?
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`ita-msg ${msg.role === "user" ? "ita-msg-user" : "ita-msg-ai"}`}>
            {renderText(msg.content)}
          </div>
        ))}
      </div>

      <div className="ita-mid-section">
        <div className="ita-morph-pair">
          <label className="ita-field-label">Email</label>
          <input className="ita-field-input" type="email" value="demo@ita.agri" readOnly />

          <div className="ita-compose-content">
            <div className="ita-compose-input">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Décrivez ce que vous observez au champ…"
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = "auto";
                  ta.style.height = ta.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className="ita-send-btn" onClick={handleSendMessage}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9l14-7-7 14-2-5-5-2z" fill="currentColor"/></svg>
              </button>
            </div>
            <div className="ita-compose-modes">
              <button className="ita-add-btn" onClick={toggleFilepicker}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              {(["plant", "pest", "soil", "analytics"] as ChatMode[]).map((m) => (
                <button
                  key={m}
                  className={`ita-mode-btn ${m === mode ? "active" : ""} ${m !== mode && collapsed ? "deselected" : ""}`}
                  onClick={() => toggleMode(m)}
                >
                  {m === "plant" ? "Plant" : m === "pest" ? "Pest" : m === "soil" ? "Soil" : "Analytics"}
                </button>
              ))}
              <div className="ita-veins-overlay">
                <svg className="ita-veins-svg" viewBox="0 0 100 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="ita-vein-main" d="M0 18 Q20 6 40 16 T70 24 T100 18"/>
                  <path className="ita-vein-main" d="M0 26 Q25 30 50 22 T80 28 T100 26" style={{animationDelay:"0.8s"}}/>
                  <path className="ita-vein-branch" d="M15 12 Q22 4 28 8" style={{animationDelay:"0.3s"}}/>
                  <path className="ita-vein-branch" d="M35 24 Q42 32 48 28" style={{animationDelay:"0.5s"}}/>
                  <path className="ita-vein-branch" d="M55 14 Q64 6 72 10" style={{animationDelay:"0.7s"}}/>
                  <path className="ita-vein-branch" d="M12 30 Q20 36 28 32" style={{animationDelay:"0.4s"}}/>
                  <path className="ita-vein-branch" d="M50 16 Q58 24 64 20" style={{animationDelay:"0.6s"}}/>
                  <path className="ita-vein-twigs" d="M22 6 Q24 2 26 4" style={{animationDelay:"0.6s"}}/>
                  <path className="ita-vein-twigs" d="M40 30 Q42 34 44 32" style={{animationDelay:"0.8s"}}/>
                  <path className="ita-vein-twigs" d="M62 8 Q64 4 66 6" style={{animationDelay:"1.1s"}}/>
                </svg>
              </div>
              <span className="ita-conf-pad" style={{cursor:"pointer"}} onClick={() => togglePanel("confidence")}>
                <span className="ita-conf-label">Confiance</span>
                <span className="ita-conf-gauge">
                    <span className="ita-conf-track">
                      <span className="ita-conf-fill" style={{width: confidence ? `${confidence.score}%` : "0%"}}></span>
                    </span>
                    <span className="ita-conf-pct">{confidence ? `${confidence.score}%` : "—"}</span>
                </span>
              </span>
              <span className="ita-compose-spacer"></span>
              <div className="ita-info-pad" style={{cursor:"pointer"}} onClick={() => togglePanel("weather")}>
                  <span className="ita-weather-info">
                    {weather ? <WeatherIcon code={weather.weather_code} size={11} /> : <WeatherIcon code={0} size={11} />}
                    {weather ? `${weather.temperature}°C` : "—"}
                    {weather ? ` • ${weather.humidity}% • ${weather.wind_speed} km/h` : ""}
                  </span>
                <span className="ita-location-info">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {location ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sendError && (
        <p style={{fontSize:"11px",color:"#C83232",textAlign:"center",marginTop:"4px"}}>{sendError}</p>
      )}
      <div className="ita-bot-section">
        <div className="ita-auth-footer"></div>
      </div>

      <div className="ita-fp-content" onClick={toggleFilepicker}>
        <div className="ita-fp-row">
          <button className="ita-fp-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} disabled={uploading}>
            {uploading ? (
              <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                <span className="ita-spinner" style={{width:12,height:12,border:"1.5px solid var(--border)",borderTopColor:"var(--brand)",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}></span>
                Upload…
              </span>
            ) : (
              <>
                <span>+ Fichier</span>
                <span className="ita-fp-ext">.pdf, .jpg, .xlsx, .doc</span>
              </>
            )}
          </button>
          <button className="ita-fp-btn ita-fp-icon-btn" onClick={(e) => { e.stopPropagation(); imageInputRef.current?.click(); }} disabled={uploading} title="Galerie">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
        </div>
        {uploadMsg && (
          <div className={`ita-fp-msg ${uploadMsg.type}`} style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",fontSize:11,fontWeight:500,background:"var(--glass-bg-solid)",padding:"4px 12px",borderRadius:6,backdropFilter:"blur(12px)",border:"1px solid var(--glass-border)",color:uploadMsg.type==="success"?"#34ab53":"#C83232"}}>{uploadMsg.text}</div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx" onChange={(e) => { const f=e.target.files?.[0]; if(f){handleUpload(f)} e.target.value="" }} style={{display:"none"}} />
      <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => { const f=e.target.files?.[0]; if(f){handleUpload(f)} e.target.value="" }} style={{display:"none"}} />
    </div>

    <div className={`ita-dp-panel-wrapper ${panelState === "open" ? "open" : ""}`}>
      <div className="ita-dp-panels-row">
        <div className="ita-dp-slot" style={{ flex: activePanel === "weather" ? "1 1 0px" : "none", width: activePanel === "weather" ? undefined : peekPanel === "weather" ? "60px" : "0px" }}>
          {activePanel === "weather" && weather && <WeatherDetailPanel weather={weather} location={location} />}
          {peekPanel === "weather" && weather && <PeekStrip type="weather" weather={weather} />}
        </div>
        <div className="ita-dp-slot" style={{ flex: activePanel === "confidence" ? "1 1 0px" : "none", width: activePanel === "confidence" ? undefined : peekPanel === "confidence" ? "60px" : "0px" }}>
          {activePanel === "confidence" && confidence && <ConfidenceDetailPanel confidence={confidence} />}
          {peekPanel === "confidence" && <PeekStrip type="confidence" />}
          {activePanel === "confidence" && !confidence && (
            <div className="ita-dp-empty">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>Aucune donnée de confiance. Envoyez un message pour obtenir un diagnostic.</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HISTORY VIEW
   ═══════════════════════════════════════════════════════════ */
const MODE_SVGS: Record<string, string> = {
  plant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-4a8 8 0 0 0-8-8"/><path d="M12 22v-4a8 8 0 0 1 8-8"/><path d="M12 2v10"/></svg>',
  pest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2M12 12h2"/></svg>',
  soil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 12 2l10 20H2z"/><path d="M8 14a4 4 0 0 1 8 0"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
};

const MODE_LBL: Record<string, string> = { plant: "Végétal", pest: "Ravageur", soil: "Sol", analytics: "Statistiques" };

function HistoryView() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState<{ id: string; mode: string; title: string; created_at: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/chat?list=true")
      .then((r) => r.ok ? r.json() : { chats: [] })
      .then((d) => setChats(d.chats ?? []));
  }, []);

  const items = chats.filter((d) => {
    if (query && !d.title?.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const marginTop = mounted ? Math.max(30, (window.innerHeight - (items.length * 56 + 200)) / 2 - 40) : 30;

  return (
    <div className="ita-card history-mode ita-morph-complete"
      style={{ marginTop: marginTop + "px" }}>
      <div className="ita-history-content" style={{display:"block"}}>
        <div className="ita-page-hdr">
          <div>
            <div className="ita-page-title">Historique</div>
            <div className="ita-page-sub">{items.length} diagnostic{items.length > 1 ? "s" : ""}</div>
          </div>
          <div className="ita-hist-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="ita-hist-list">
          {items.length === 0 ? (
            <div style={{textAlign:"center",padding:"30px",color:"var(--text-muted)",fontSize:"12px"}}>Aucun diagnostic</div>
          ) : items.map((d) => (
            <div key={d.id} className="ita-hist-card"
              onClick={() => window.location.href = "/chat/" + d.id}>
              <div className={`ita-hc-icon ${d.mode}`} dangerouslySetInnerHTML={{__html: MODE_SVGS[d.mode]}} />
              <div className="ita-hc-body">
                <div className="ita-hc-title">{d.title || "Diagnostic"}</div>
                <div className="ita-hc-meta">{new Date(d.created_at).toLocaleDateString("fr")}<span className="ita-dot"></span>{MODE_LBL[d.mode] || d.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL VIEW
   ═══════════════════════════════════════════════════════════ */
function DetailView({ id }: { id: string }) {
  const [data, setData] = useState<{ chat: Record<string, string>; messages: Record<string, unknown>[] } | null>(null);
  const [pct, setPct] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/chat?chatId=" + id)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        setData(d);
        const lastAssistant = d?.messages?.filter((m: Record<string, unknown>) => m.role === "assistant").pop();
        const conf = (lastAssistant?.confidence as { score?: number })?.score || 85;
        setTimeout(() => setPct(conf), 100);
      });
  }, [id]);

  const lastAssistant = data?.messages?.filter((m: Record<string, unknown>) => m.role === "assistant").pop();
  const lastContent = (lastAssistant?.content as string) || "";
  const circ = 2 * Math.PI * 17;
  const offset = circ - (circ * pct / 100);
  const confLvl = pct >= 80 ? "Élevée" : pct >= 60 ? "Moyenne" : "Faible";
  const mt = mounted ? Math.max(30, (window.innerHeight - 580) / 2 - 40) : 30;

  return (
    <div className="ita-card detail-mode ita-morph-complete" style={{ marginTop: mt + "px" }}>
      <div className="ita-detail-content" style={{display:"block"}}>
        <div className="ita-detail-back">
          <button onClick={() => window.location.href = "/?view=history"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Historique
          </button>
        </div>
        <div className="ita-detail-hdr">
          <div className="ita-detail-title">{(data?.chat?.title as string) || "Diagnostic"}</div>
          <div className="ita-detail-meta">
            {data?.chat?.created_at ? new Date(data.chat.created_at as string).toLocaleDateString("fr") : ""}
            <span className="ita-dot"></span>{data?.chat?.mode as string || ""}
          </div>
        </div>
        <div className="ita-detail-ring">
          <div className="ita-dr-ring">
            <svg viewBox="0 0 44 44"><circle className="bg" cx="22" cy="22" r="17"/><circle className="fg" cx="22" cy="22" r="17" strokeDasharray={circ} strokeDashoffset={offset}/></svg>
            <span className="pct">{pct}%</span>
          </div>
          <div className="ita-dr-info">
            <div className="ita-dr-label">Confiance diagnostique</div>
            <div className="ita-dr-title">{confLvl}</div>
            <div className="ita-dr-sub">Analyse des symptômes et historique cultural</div>
          </div>
        </div>
        <div className="ita-detail-box">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>Diagnostic</h4>
          <div className="ita-danalysis" style={{whiteSpace:"pre-wrap",fontSize:"12px"}}>{lastContent}</div>
        </div>
      </div>
    </div>
  );
}
