import { AlertCircle } from 'lucide-react'
import { OfferStatus, getStatusColor, getStatusLabel } from '../../lib/utils/offerStatus'
import { useTranslation } from '../../lib/context/LanguageContext'

interface StatusBadgeProps {
  status: OfferStatus
  isUrgent?: boolean
}

export function StatusBadge({ status, isUrgent }: StatusBadgeProps) {
  const { t } = useTranslation()
  
  if (isUrgent && status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        {t('status.urgent')}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusLabel(status, t)}
    </span>
  )
}