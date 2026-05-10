"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div style={{ padding: 24, fontFamily: "sans-serif" }}>Chargement...</div>;

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/sessions", label: "Sessions" },
    { href: "/observe", label: "Observation" },
    { href: "/lab", label: "Lab" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Musa&apos;id</div>
        <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: pathname === l.href ? "#1B6B3A" : "#666", textDecoration: "none", fontWeight: pathname === l.href ? 600 : 400 }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
          style={{ background: "none", border: "1px solid #ccc", borderRadius: 6, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}
        >
          Déconnexion
        </button>
      </header>
      <main style={{ flex: 1, padding: 24, background: "#f9fafb" }}>{children}</main>
    </div>
  );
}
