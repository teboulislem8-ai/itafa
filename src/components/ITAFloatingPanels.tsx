"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getNextStepsWithCheck, toggleStep, allChecked, subscribe } from "@/lib/next-steps-store";
import { initTheme, toggleTheme, getTheme, subscribe as themeSubscribe } from "@/lib/theme-store";
import type { NextStep } from "@/types/ai";
import type { UploadedFileRow, GeneratedDocumentRow } from "@/types/database";
import type { Theme } from "@/lib/theme-store";

interface NextStepWithCheck extends NextStep {
  checked: boolean;
}

const PRIORITY_COLORS: Record<NextStep["priority"], string> = {
  high: "#4E3526",
  medium: "#3A4A28",
  low: "#8A7F6E",
};

const PRIORITY_LABELS: Record<NextStep["priority"], string> = {
  high: "Urgent",
  medium: "Recommandé",
  low: "Optionnel",
};

export function ITAFloatingPanels() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const isProfilePage = pathname === "/profile";
  const hideExtraPanels = isProfilePage || (pathname === "/" && (view === "history" || view === "detail"));
  const sidebarOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [checkedSteps, setCheckedSteps] = useState<NextStepWithCheck[]>(() => getNextStepsWithCheck() as NextStepWithCheck[]);
  const [theme, setTheme] = useState<Theme>("light");
  const [files, setFiles] = useState<UploadedFileRow[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocumentRow[]>([]);
  const [panelChatId, setPanelChatId] = useState<string | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    initTheme();
    setTheme(getTheme());
    return themeSubscribe((t) => setTheme(t));
  }, []);

  useEffect(() => {
    const match = pathname.match(/^\/chat\/([a-f0-9-]+)$/);
    setPanelChatId(match ? match[1] : null);
  }, [pathname]);

  const fetchPanelData = useCallback(async (chatId: string | null) => {
    if (!chatId) {
      setFiles([]);
      setDocuments([]);
      return;
    }
    setPanelLoading(true);
    try {
      const r = await fetch(`/api/chat?chatId=${chatId}`);
      const data = await r.json();
      setFiles(data.files ?? []);
      setDocuments(data.documents ?? []);
    } catch {
      setFiles([]);
      setDocuments([]);
    } finally {
      setPanelLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPanelData(panelChatId);
  }, [panelChatId, fetchPanelData]);

  useEffect(() => {
    function onFilesChanged() {
      fetchPanelData(panelChatId);
    }
    window.addEventListener("ita-files-changed", onFilesChanged);
    return () => window.removeEventListener("ita-files-changed", onFilesChanged);
  }, [panelChatId, fetchPanelData]);

  useEffect(() => {
    return subscribe(() => {
      setCheckedSteps(getNextStepsWithCheck() as NextStepWithCheck[]);
    });
  }, []);

  const closeAllPanels = useCallback(() => {
    const body = document.body;
    body.classList.remove("ita-sidebar-open", "ita-files-open", "ita-checklist-open");
    const fp = document.getElementById("ita-files-panel");
    if (fp) fp.style.top = "";
  }, []);

  useEffect(() => {
    return () => { closeAllPanels(); };
  }, [closeAllPanels]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const so = document.body.classList.contains("ita-sidebar-open");
      const fo = document.body.classList.contains("ita-files-open");
      const co = document.body.classList.contains("ita-checklist-open");
      if (!so && !fo && !co) return;
      const insideSidebar = target.closest(".ita-sidebar");
      const insideFiles = target.closest(".ita-files-panel");
      const insideChecklist = target.closest(".ita-checklist-panel");
      if (!insideSidebar && !insideFiles && !insideChecklist) {
        if (sidebarOpenTimer.current) {
          clearTimeout(sidebarOpenTimer.current);
          sidebarOpenTimer.current = null;
        }
        const fp = document.getElementById("ita-files-panel");
        if (fp) fp.style.top = "";
        document.body.classList.remove("ita-sidebar-open", "ita-files-open", "ita-checklist-open");
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function toggleSidebar() {
    const body = document.body;
    const filesPanel = document.getElementById("ita-files-panel");
    const sidebar = document.getElementById("ita-sidebar");
    if (sidebarOpenTimer.current) {
      clearTimeout(sidebarOpenTimer.current);
      sidebarOpenTimer.current = null;
    }
    if (body.classList.contains("ita-sidebar-open")) {
      if (filesPanel) filesPanel.style.top = "";
      body.classList.remove("ita-sidebar-open");
    } else {
      body.classList.add("ita-sidebar-open");
      sidebarOpenTimer.current = setTimeout(() => {
        if (filesPanel && sidebar) {
          filesPanel.style.top = (24 + sidebar.offsetHeight + 12) + "px";
        }
        sidebarOpenTimer.current = null;
      }, 540);
    }
  }

  function closeSidebar() {
    if (sidebarOpenTimer.current) {
      clearTimeout(sidebarOpenTimer.current);
      sidebarOpenTimer.current = null;
    }
    const fp = document.getElementById("ita-files-panel");
    if (fp) fp.style.top = "";
    document.body.classList.remove("ita-sidebar-open");
  }

  const fileCount = files.length;
  const docCount = documents.length;
  const steps = checkedSteps;
  const allDone = allChecked();
  const hasSteps = steps.length > 0;

  function phaseState(phase: number): "done" | "active" | "pending" {
    const fileOk = fileCount > 0;
    if (phase === 0) {
      if (fileOk && hasSteps) return "done";
      if (fileOk) return "active";
      return "pending";
    }
    if (phase === 1) {
      if (hasSteps) return "done";
      if (fileOk && hasSteps) return "done";
      if (phaseState(0) === "done") return "active";
      return "pending";
    }
    if (phase === 2) {
      if (allDone) return "done";
      if (hasSteps) return "active";
      return "pending";
    }
    if (phase === 3) {
      if (docCount > 0) return "done";
      if (allDone) return "active";
      return "pending";
    }
    return "pending";
  }

  const donePhases = [0, 1, 2, 3].filter((p) => phaseState(p) === "done").length;
  const progressPct = donePhases >= 4 ? "100%" : `${Math.round((donePhases / 4) * 100)}%`;

  const PHASE_LABELS = ["Analyse", "Diagnostic", "Recommandations", "Rapport"];

  async function handleGenerateReport() {
    if (!panelChatId) return;
    setGenerating(true);
    setGenError(null);
    try {
      const r = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: panelChatId, type: "session_report" }),
      });
      if (!r.ok) {
        const errBody = await r.json().catch(() => ({ error: "Échec de la génération" }));
        throw new Error(errBody.error ?? "Échec de la génération");
      }
      await fetchPanelData(panelChatId);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setGenerating(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function fileIcon(mime: string) {
    if (mime.startsWith("image/")) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    );
  }

  return (
    <div className="ita-panels-wrap">
      {/* ── SIDEBAR ── */}
      <div className="ita-sidebar" id="ita-sidebar" onClick={toggleSidebar}>
        <div className="ita-sidebar-inner">
          <div className="ita-sidebar-header">
            <div className="ita-sidebar-icon">
              <svg width="22" height="10" viewBox="370 567 760 366" xmlns="http://www.w3.org/2000/svg">
                <path fill="#34ab53" d="M749.4 922.8C544.9 922.3 379.6 749.4 379.6 749.4S545.7 577.2 750.5 577.4C955.2 577.6 1120.3 750.8 1120.3 750.8S954 923.3 749.4 922.8Z"/>
                <g transform="matrix(0.749992,-0.00354228,0.00354228,0.749992,315.877681,730.442485)">
                  <path fill="none" stroke="#1a4a1e" strokeWidth="22" strokeLinecap="round" d="M0.6 26.1C349 10.6 708.2 10.6 1078.3 26.1"/>
                </g>
              </svg>
            </div>
            <span className="ita-sidebar-title">ITA Field Assistant</span>
          </div>
          <div className="ita-sidebar-nav-wrap">
            <nav className="ita-sidebar-nav">
              <a href="/" className="ita-sidebar-item active" onClick={(e) => { e.stopPropagation(); closeSidebar(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Nouveau diagnostic</span>
              </a>
              <a href="/?view=history" className="ita-sidebar-item" onClick={(e) => { e.stopPropagation(); closeSidebar(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Historique</span>
              </a>
              <a href="/profile" className="ita-sidebar-item" onClick={(e) => { e.stopPropagation(); closeSidebar(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Mon profil</span>
              </a>
              <div className="ita-sidebar-divider"></div>
              <button className="ita-sidebar-item" onClick={(e) => { e.stopPropagation(); closeSidebar(); toggleTheme(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {theme === "dark" ? (
                    <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
                  ) : (
                    <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>
                  )}
                </svg>
                <span>{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>
              </button>
              <button className="ita-sidebar-item ita-sidebar-signout" onClick={(e) => { e.stopPropagation(); closeSidebar(); signOut(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILES PANEL ── */}
      {!hideExtraPanels && <div className="ita-files-panel" id="ita-files-panel" onClick={toggleFilesPanel}>
        <div className="ita-files-inner">
          <div className="ita-files-header">
            <div className="ita-files-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span className="ita-files-title">Fichiers & Diagnostic</span>
          </div>
          <div className="ita-files-body" onClick={(e) => e.stopPropagation()}>
            <div className="ita-files-content">
              <div className="ita-files-section-label">Fichiers joints</div>
              {fileCount === 0 ? (
                <div className="ita-file-empty">Aucun fichier joint</div>
              ) : (
                files.map((f) => (
                  <div key={f.id} className="ita-file-item">
                    {fileIcon(f.mime_type)}
                    <div className="ita-file-item-info">
                      <div className="ita-file-item-name">{f.original_name}</div>
                      <div className="ita-file-item-size">{formatSize(f.size_bytes)}</div>
                    </div>
                  </div>
                ))
              )}
              <div className="ita-files-section-label">Progression du diagnostic</div>
              <div className="ita-progress-bar">
                <div className="ita-progress-fill" style={{width: progressPct}}></div>
              </div>
              <div className="ita-steps ita-steps-4">
                {PHASE_LABELS.map((label, i) => (
                  <div key={i} className={`ita-step ${phaseState(i)}`}>
                    <span className="ita-step-dot"></span>{label}
                  </div>
                ))}
              </div>
              {docCount > 0 && (
                <>
                  <div className="ita-files-section-label">Documents générés</div>
                  {documents.map((d) => (
                    <div key={d.id} className="ita-file-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      <div className="ita-file-item-info">
                        <div className="ita-file-item-name">{d.type.replace("_", " ")}</div>
                        <div className="ita-file-item-size">{new Date(d.created_at).toLocaleDateString("fr-FR")}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {allDone && docCount === 0 && (
                <div className="ita-gen-report-wrap">
                  <button
                    className="ita-gen-report-btn"
                    onClick={handleGenerateReport}
                    disabled={generating}
                  >
                    {generating ? "Génération en cours..." : "Générer le rapport"}
                  </button>
                  {genError && <div className="ita-gen-report-error">{genError}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>}

      {/* ── CHECKLIST / NEXT STEPS PANEL ── */}
      {!hideExtraPanels && <div className="ita-checklist-panel" id="ita-checklist-panel" onClick={toggleChecklist}>
        <div className="ita-checklist-inner">
          <div className="ita-checklist-header">
            <div className="ita-checklist-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="ita-checklist-title">Prochaines étapes</span>
          </div>
          <div className="ita-checklist-body" onClick={(e) => e.stopPropagation()}>
            <div className="ita-checklist-content">
              {steps.length > 0 ? (
                <>
                  <div className="ita-checklist-section-label">Actions recommandées</div>
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className={`ita-check-item ${step.checked ? "checked" : ""}`}
                      onClick={() => toggleStep(i)}
                    >
                      <span className="ita-checkbox">
                        {step.checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </span>
                      <div className="ita-check-info">
                        <div className="ita-check-label">{step.action}</div>
                        <div className="ita-ns-meta">
                          <span className="ita-ns-dot" style={{ backgroundColor: PRIORITY_COLORS[step.priority] }}></span>
                          {PRIORITY_LABELS[step.priority]}{step.detail ? ` · ${step.detail}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="ita-check-empty">
                  <div className="ita-check-empty-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="ita-check-empty-text">Aucune étape recommandée pour l'instant</div>
                  <div className="ita-check-empty-sub">Envoyez un message pour obtenir des recommendations</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

function toggleFilesPanel() {
  document.body.classList.toggle("ita-files-open");
}

function toggleChecklist() {
  document.body.classList.toggle("ita-checklist-open");
}

async function signOut() {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {}
  window.location.href = "/login";
}
