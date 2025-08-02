import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '../../lib/context/LanguageContext'

type LanguageSwitcherProps = {
  showIcon?: boolean
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({ showIcon = true, variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === language)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'fr' | 'en' | 'de')
    setIsOpen(false)
  }

  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
          aria-label="Changer de langue"
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline text-gray-700">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  language === lang.code ? 'bg-primary/5 text-primary' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label="Changer de langue"
      >
        {showIcon && <Globe className="h-4 w-4 text-gray-500" />}
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm text-gray-700">{currentLanguage?.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                language === lang.code 
                  ? 'bg-primary/5 text-primary border-r-2 border-primary' 
                  : 'text-gray-700'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && (
                <span className="text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple language flag display component for when space is very limited
export function LanguageFlag() {
  const { language, languages } = useLanguage()
  const currentLanguage = languages.find(lang => lang.code === language)
  
  return (
    <span className="text-lg" title={currentLanguage?.name}>
      {currentLanguage?.flag}
    </span>
  )
}