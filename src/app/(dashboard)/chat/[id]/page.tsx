"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/use-chat";
import { WeatherIcon } from "@/lib/weather-icons";
import { renderText } from "@/lib/render-text";
import type { ChatMode } from "@/types/database";
import { WeatherDetailPanel } from "@/components/WeatherDetailPanel";
import { ConfidenceDetailPanel } from "@/components/ConfidenceDetailPanel";

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { messages, sendMessage, loadMessages, weather, location, confidence, loadWeather } = useChat();
  const [mode, setMode] = useState<ChatMode>("plant");
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [sendError, setSendError] = useState("");
  const [filepickerOpen, setFilepickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{type:"success"|"error";text:string} | null>(null);
  const [openPanel, setOpenPanel] = useState<"weather" | "confidence" | null>(null);
  const [panelState, setPanelState] = useState<"closed" | "open" | "closing">("closed");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCloseTimer = () => { if (closeTimerRef.current !== null) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; } };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages(id).then((chatMode) => {
      if (chatMode as string | undefined) setMode(chatMode as ChatMode);
      setHasMessages(true);
      setCollapsed(true);
      setReady(true);
    });
    loadWeather();
  }, [id, loadMessages, loadWeather]);

  function togglePanel(name: "weather" | "confidence") {
    if (openPanel === name) {
      clearCloseTimer();
      setPanelState("closing");
      closeTimerRef.current = setTimeout(() => {
        setPanelState("closed");
        setOpenPanel(null);
      }, 350);
    } else {
      clearCloseTimer();
      setOpenPanel(name);
      setPanelState("open");
    }
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      setSendError("");
      setHasMessages(true);
      setThinking(true);
      try {
        const result = await sendMessage(text, mode, id);
        if (!result) setSendError("Échec de l'envoi");
      } catch (e) {
        setSendError(e instanceof Error ? e.message : "Erreur lors de l'envoi");
      }
      setThinking(false);
    },
    [sendMessage, mode, id],
  );

  function toggleMode(m: ChatMode) {
    if (hasMessages) return;
    if (m === mode) {
      setCollapsed((c) => !c);
    } else {
      setMode(m);
      setCollapsed(true);
    }
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
    fd.append("chatId", id);
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

  if (!ready) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
        <div className="ita-spinner" style={{width:24,height:24,border:"2px solid var(--border)",borderTopColor:"var(--brand)",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}></div>
      </div>
    );
  }

  return (
    <div className="ita-dp-container">
    <div className={`ita-card ${filepickerOpen ? "filepicker-mode" : "compose-mode"} ita-morph-complete ${thinking ? "ita-thinking" : ""}`}
      style={{ width: "100%" }}>
      <div className="ita-chat-area">
        <div className="ita-msg ita-msg-ai">
          Reprise du diagnostic. Comment puis-je vous aider?
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
                    const ta = textareaRef.current;
                    if (ta && ta.value.trim()) {
                      const text = ta.value;
                      ta.value = "";
                      ta.style.height = "36px";
                      handleSend(text);
                    }
                  }
                }}
              />
              <button className="ita-send-btn" onClick={() => {
                const ta = textareaRef.current;
                if (ta && ta.value.trim()) {
                  const text = ta.value;
                  ta.value = "";
                  ta.style.height = "36px";
                  handleSend(text);
                }
              }}>
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
                >{m === "plant" ? "Plant" : m === "pest" ? "Pest" : m === "soil" ? "Soil" : "Analytics"}</button>
              ))}
              <div className="ita-veins-overlay">
                <svg className="ita-veins-svg" viewBox="0 0 100 36" preserveAspectRatio="none">
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
                   <span className="ita-conf-track"><span className="ita-conf-fill" style={{width: confidence ? `${confidence.score}%` : "0%"}}></span></span>
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
      {openPanel !== null && openPanel === "weather" && weather && <WeatherDetailPanel weather={weather} location={location} />}
      {openPanel !== null && openPanel === "confidence" && confidence && <ConfidenceDetailPanel confidence={confidence} />}
    </div>
    </div>
  );
}
