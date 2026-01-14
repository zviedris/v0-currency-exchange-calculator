"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language, type TranslationKeys } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
  getCurrencyName: (code: string) => string
  getMonthName: (index: number, short?: boolean) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("lv")

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("currency-calc-language") as Language
    if (saved && (saved === "lv" || saved === "en")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("currency-calc-language", lang)
  }

  const getCurrencyName = (code: string): string => {
    return translations[language].currencies[code as keyof typeof translations.lv.currencies] || code
  }

  const getMonthName = (index: number, short = false): string => {
    if (short) {
      return translations[language].months.short[index] || ""
    }
    return translations[language].months.full[index] || ""
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
        getCurrencyName,
        getMonthName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
