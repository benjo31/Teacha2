import { format } from 'date-fns'

export type OfferStatus = 'active' | 'filled' | 'expired'

export function calculateOfferStatus(endDate: string, currentStatus: string): OfferStatus {
  // Si l'offre est déjà pourvue, garder ce statut
  if (currentStatus === 'filled') {
    return 'filled'
  }
  
  const now = new Date()
  const offerEndDate = new Date(endDate)
  
  // Comparer uniquement les dates sans les heures
  const today = new Date(format(now, 'yyyy-MM-dd'))
  const end = new Date(format(offerEndDate, 'yyyy-MM-dd'))
  
  return end < today ? 'expired' : 'active'
}

export function getStatusColor(status: OfferStatus) {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'filled':
      return 'bg-green-100 text-green-800'
    case 'expired':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusLabel(status: OfferStatus, t?: (key: string) => string) {
  if (!t) {
    // Fallback to French labels when translation function is not available
    switch (status) {
      case 'active':
        return 'Actif'
      case 'filled':
        return 'Pourvu'
      case 'expired':
        return 'Expiré'
      default:
        return status
    }
  }

  switch (status) {
    case 'active':
      return t('status.active')
    case 'filled':
      return t('status.filled')
    case 'expired':
      return t('status.expired')
    default:
      return status
  }
}