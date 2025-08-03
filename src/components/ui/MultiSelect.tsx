import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useTranslation } from '../../lib/context/LanguageContext'

interface MultiSelectProps {
  label?: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
  className?: string
  searchable?: boolean
  allowCustomValue?: boolean
  placeholder?: string
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  error,
  className,
  searchable = true,
  allowCustomValue = false,
  placeholder
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  useOnClickOutside(containerRef, () => setIsOpen(false))

  // Filtrer les options en fonction de la recherche
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const handleRemove = (optionToRemove: string) => {
    onChange(value.filter(v => v !== optionToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && allowCustomValue && search.trim()) {
      e.preventDefault()
      onChange([search.trim()])
      setSearch('')
      setIsOpen(false)
    }
  }

  // Focus l'input quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className={cn("space-y-1", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <div 
          className={cn(
            "min-h-[2.75rem] w-full rounded-lg border bg-white px-3 py-2",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            error && "border-error focus-within:border-error focus-within:ring-error/20",
            "cursor-pointer"
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm text-primary"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item)
                  }}
                  className="rounded-full p-0.5 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {searchable && (
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border-none p-0 text-sm focus:outline-none focus:ring-0"
                placeholder={value.length === 0 ? placeholder || t('common.search') + '...' : ""}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
              />
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {filteredOptions.length === 0 && !allowCustomValue ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                {t('common.noResults')}
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-sm",
                      "hover:bg-gray-50",
                      value.includes(option) && "text-primary"
                    )}
                  >
                    {option}
                    {value.includes(option) && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
                {allowCustomValue && search.trim() && !filteredOptions.includes(search.trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange([search.trim()])
                      setSearch('')
                      setIsOpen(false)
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-primary hover:bg-gray-50"
                  >
                    Ajouter "{search.trim()}"
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error animate-fade-in">{error}</p>
      )}
    </div>
  )
}