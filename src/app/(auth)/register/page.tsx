"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { data, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authErr) {
      setError(authErr.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        language_pref: "fr",
      });
    }

    router.push("/");
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Musa&apos;id — Inscription</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Créez votre compte agent</p>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text" placeholder="Nom complet" required value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="email" placeholder="Email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password" placeholder="Mot de passe (min 6 caractères)" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, background: "#1B6B3A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Créer mon compte
        </button>
        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16, fontSize: 13, textAlign: "center" }}>
        Déjà un compte ? <a href="/login" style={{ color: "#1B6B3A" }}>Se connecter</a>
      </p>
    </main>
  );
}
