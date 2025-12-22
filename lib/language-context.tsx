"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.ar
  dir: "rtl" | "ltr"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLanguage = "ar" }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  // Update language when initialLanguage prop changes (e.g., when navigating between /ar and /en)
  useEffect(() => {
    console.log("[v0] LanguageProvider - initialLanguage changed to:", initialLanguage)
    setLanguageState(initialLanguage)
    localStorage.setItem("language", initialLanguage)
    document.documentElement.lang = initialLanguage
    document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr"
  }, [initialLanguage])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"

    // We might want to redirect here if the user changes language via UI
    // But the UI component calling this should handle the redirect.
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === "ar" ? "rtl" : "ltr",
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
