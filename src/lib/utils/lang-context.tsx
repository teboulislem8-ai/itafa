"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

type Lang = "ar" | "fr";

interface LangContext {
  lang: Lang;
  dir: "ltr" | "rtl";
  toggleLang: () => void;
  setLang: (l: Lang) => void;
  t: (fr: string, ar: string) => string;
}

const LangCtx = createContext<LangContext>({
  lang: "fr",
  dir: "ltr",
  toggleLang: () => {},
  setLang: () => {},
  t: (fr: string) => fr,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("profiles").select("language_pref").eq("id", user.id).single().then(({ data }) => {
        if (data?.language_pref && data.language_pref !== "auto") {
          setLangState(data.language_pref as Lang);
        }
      });
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from("profiles").update({ language_pref: l }).eq("id", user.id);
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "fr" ? "ar" : "fr");
  }, [lang, setLang]);

  const t = useCallback((fr: string, ar: string) => (lang === "ar" ? ar : fr), [lang]);

  return (
    <LangCtx.Provider value={{ lang, dir, toggleLang, setLang, t }}>
      <div dir={dir} lang={lang}>
        {children}
      </div>
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}
