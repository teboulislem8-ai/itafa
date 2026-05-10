"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) {
      setError(authErr.message);
      return;
    }
    router.push("/");
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Musa&apos;id — Connexion</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Assistant de terrain agricole</p>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email" placeholder="Email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password" placeholder="Mot de passe" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Se connecter
        </button>
        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16, fontSize: 13, textAlign: "center" }}>
        Pas de compte ? <a href="/register" style={{ color: "#1B6B3A" }}>S&apos;inscrire</a>
      </p>
    </main>
  );
}
