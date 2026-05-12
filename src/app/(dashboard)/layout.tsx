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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      setLoading(false);
    });
  }, [router]);

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
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", fontFamily: "var(--font-body)" }}>
      {/* Fixed left sidebar */}
      <aside style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 240,
        height: "100vh",
        background: "var(--bg-olive)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LeafLogo />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-inverse)", lineHeight: 1 }}>ITA</div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-inv-muted)" }}>Field Assistant</div>
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Sign out */}
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
      <main style={{ marginLeft: 240, padding: 24 }}>{children}</main>
    </div>
  );
}