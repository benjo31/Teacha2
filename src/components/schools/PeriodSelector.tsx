import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTranslation } from '../../lib/context/LanguageContext'

interface PeriodSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function PeriodSelector({ value, onChange, error }: PeriodSelectorProps) {
  const { t } = useTranslation()
  
  const periods = [
    { id: 'morning', label: t('school.periods.morning') },
    { id: 'afternoon', label: t('school.periods.afternoon') }
  ]

  const togglePeriod = (periodId: string) => {
    if (value.includes(periodId)) {
      onChange(value.filter(p => p !== periodId))
    } else {
      onChange([...value, periodId])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('school.periods.title')}
      </label>
      <div className="flex gap-4">
        {periods.map(period => (
          <button
            key={period.id}
            type="button"
            onClick={() => togglePeriod(period.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              value.includes(period.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-300 hover:border-primary/50"
            )}
          >
            {value.includes(period.id) && <Check className="h-4 w-4" />}
            {period.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-error animate-fade-in">{error}</p>
      )}
    </div>
  )
}