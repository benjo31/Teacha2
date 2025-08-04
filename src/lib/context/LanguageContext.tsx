import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'

// Import translation files
import frTranslations from '../../translations/fr.json'
import enTranslations from '../../translations/en.json'
import deTranslations from '../../translations/de.json'

export type Language = 'fr' | 'en' | 'de'

type Translations = typeof frTranslations

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  languages: Array<{ code: Language; name: string; flag: string }>
}

const translations: Record<Language, Translations> = {
  fr: frTranslations,
  en: enTranslations,
  de: deTranslations
}

const languageOptions = [
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }
]

// Create default context value to avoid null context issues
const defaultContextValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  languages: [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }
  ]
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

// Helper function to get nested object values using dot notation
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

// Helper function to replace placeholders with parameters
function interpolate(text: string, params: Record<string, string | number> = {}): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

export function LanguageProvider({ children }: PropsWithChildren) {
  // Initialize language from localStorage or default to French
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teacha-language') as Language
      if (saved && ['fr', 'en', 'de'].includes(saved)) {
        return saved
      }
      
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('de')) return 'de'
      if (browserLang.startsWith('en')) return 'en'
      return 'fr' // Default to French for Swiss users
    }
    return 'fr'
  })

  // Update localStorage and document language when language changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('teacha-language', newLanguage)
      document.documentElement.lang = newLanguage
    }
  }

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations[language]) {
      console.warn(`Translation language '${language}' not found, falling back to French`)
      return getNestedValue(translations.fr, key) || key
    }
    const translation = getNestedValue(translations[language], key)
    
    if (translation === undefined) {
      // Fallback to French if translation not found
      const fallback = getNestedValue(translations.fr, key)
      if (fallback === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key // Return the key if no translation found
      }
      return interpolate(fallback, params)
    }
    
    return interpolate(translation, params)
  }

  // Set document language on mount and language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const value = {
    language,
    setLanguage,
    t,
    languages: languageOptions
  }
  
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  // With the default context value, this should never be null
  // But we keep the check for safety
  if (!context || context === defaultContextValue) {
    console.warn('Using default LanguageContext - LanguageProvider may not be properly set up')
  }
  return context
}

// Convenience hook for just the translation function
export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}