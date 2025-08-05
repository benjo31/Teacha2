import { GraduationCap } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

export function LoadingSpinner() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="relative">
        <GraduationCap className="h-12 w-12 text-primary animate-bounce" />
        <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
      <div className="mt-4 text-gray-500 animate-pulse">
        {t('loadingSpinner.loading')}
      </div>
    </div>
  )
}