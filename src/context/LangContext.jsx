import React, { createContext, useContext, useState } from "react"
import { translations } from "../data/translations"

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en")
  const t = translations[lang]
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
