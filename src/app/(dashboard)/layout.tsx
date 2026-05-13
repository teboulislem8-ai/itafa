"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const LeafLogo = () => (
  <svg width="36" height="17" viewBox="370 567 760 366" xmlns="http://www.w3.org/2000/svg">
    <path fill="#34ab53" d="M749.4 922.8C544.9 922.3 379.6 749.4 379.6 749.4S545.7 577.2 750.5 577.4C955.2 577.6 1120.3 750.8 1120.3 750.8S954 923.3 749.4 922.8Z" />
    <g transform="matrix(0.749992,-0.00354228,0.00354228,0.749992,315.877681,730.442485)">
      <path fill="none" stroke="#EAE1D0" strokeWidth="20" strokeLinecap="round" d="M0.6 26.1C349 10.6 708.2 10.6 1078.3 26.1" />
    </g>
    <g transform="matrix(0.670969,-0.335113,0.335113,0.670969,464.748497,742.395972)">
      <path fill="none" stroke="#EAE1D0" strokeWidth="9" strokeLinecap="round" d="M0.2 14.1C156.6-1.4 317.8-1.4 483.9 14.1" />
    </g>
    <g transform="matrix(-0.694646,-0.282783,0.282783,-0.694646,840.289641,914.049573)">
      <path fill="none" stroke="#EAE1D0" strokeWidth="9" strokeLinecap="round" d="M0.2 14.1C174.5-1.4 354.2-1.4 539.3 14.1" />
    </g>
  </svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <LeafLogo />
        <span style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.08em" }}>Chargement…</span>
      </div>
    </div>
  );

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/sessions", label: "Sessions" },
    { href: "/observe", label: "Observation" },
    { href: "/lab", label: "Lab" },
  ];

  return (
    <>
      <style>{`
        .dash-root {
          min-height: 100vh;
          background: var(--bg-canvas);
          font-family: var(--font-body);
          overflow-x: hidden;
        }
        .sidebar-desktop {
          position: fixed; left: 0; top: 0;
          width: 240px; height: 100vh;
          background: var(--bg-olive);
          display: flex; flex-direction: column;
          z-index: 100;
        }
        .dashboard-main {
          margin-left: 240px;
          padding: 24px;
        }
        .mobile-topbar {
          display: none;
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .dashboard-main { margin-left: 0; padding: 12px; }
          .mobile-topbar {
            display: flex;
            height: 48px;
            background: var(--bg-olive);
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            position: sticky;
            top: 0;
            z-index: 50;
          }
          .dashboard-main h1 {
            font-size: 20px !important;
          }
        }
      `}</style>

      <div className="dash-root">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LeafLogo />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-inverse)", lineHeight: 1 }}>ITA</div>
              <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-inv-muted)" }}>Field Assistant</div>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-inverse)" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div className="mobile-overlay" style={{
          position: "fixed",
          left: 0, right: 0, top: 0, bottom: 0,
          background: "var(--bg-olive)",
          zIndex: 200,
          display: isMenuOpen ? "flex" : "none",
          flexDirection: "column",
          padding: "20px 16px",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-inverse)", cursor: "pointer", fontSize: 24, padding: 4 }}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 32 }}>
            <LeafLogo />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-inverse)", lineHeight: 1 }}>ITA</div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-inv-muted)" }}>Field Assistant</div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontSize: 16,
                fontWeight: 500,
                color: pathname === l.href ? "var(--text-inverse)" : "var(--text-inv-muted)",
                textDecoration: "none",
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: pathname === l.href ? "rgba(255,255,255,0.1)" : "transparent",
              }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ flex: 1 }} />
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-inv-muted)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
              width: "100%",
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Fixed left sidebar (desktop/tablet) */}
        <aside className="sidebar-desktop">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LeafLogo />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-inverse)", lineHeight: 1 }}>ITA</div>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-inv-muted)" }}>Field Assistant</div>
              </div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: 12 }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontSize: 14,
                fontWeight: 500,
                color: pathname === l.href ? "var(--text-inverse)" : "var(--text-inv-muted)",
                textDecoration: "none",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                background: pathname === l.href ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 140ms ease",
              }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ flex: 1 }} />
          <div style={{ padding: 12 }}>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-inv-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
                width: "100%",
              }}
            >
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-main">{children}</main>
      </div>
    </>
  );
}