import { X, MapPin, Calendar, Clock, School, AlertCircle, GraduationCap, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { calculateOfferStatus } from '../../lib/utils/offerStatus'
import { StatusBadge } from '../ui/StatusBadge'
import { getSubjectsDisplay } from '../../lib/utils/subjects'

interface OfferDetailsModalProps {
  offer: {
    id: string
    schoolId: string
    schoolName: string
    class: string
    location: string
    subjects?: string[]
    teachingLevel: string
    startDate: string
    endDate: string
    totalLessons: number
    periods?: string[]
    topic?: string
    qualifications?: string
    createdAt: any
    status: string
    isUrgent?: boolean
  }
  onClose: () => void
  onApply?: () => void
  hideApplyButton?: boolean
}

export default function OfferDetailsModal({ offer, onClose, onApply, hideApplyButton = false }: OfferDetailsModalProps) {
  const status = calculateOfferStatus(offer.endDate, offer.status)
  
  const formatDateRange = () => {
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, 'EEEE d MMMM yyyy', { locale: fr })
    }
    
    return `Du ${format(startDate, 'd MMMM', { locale: fr })} au ${format(endDate, 'd MMMM yyyy', { locale: fr })}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-start p-6 sticky top-0 bg-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold">
                {offer.subjects ? getSubjectsDisplay(offer.subjects) : ''} - {offer.class}
              </h2>
              <StatusBadge status={status} isUrgent={offer.isUrgent} />
            </div>
            <div className="flex items-center text-gray-600">
              <School className="h-4 w-4 mr-2" />
              {offer.schoolName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {offer.location}
            </div>
            <div className="flex items-center text-gray-600">
              <GraduationCap className="h-5 w-5 mr-2" />
              {offer.teachingLevel}
            </div>
            <div className="col-span-2 flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDateRange()}
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium mb-2 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              Horaires
            </h3>
            <p className="text-gray-600">{offer.totalLessons} leçons</p>
            {offer.periods && (
              <div className="flex items-center text-gray-600">
                {offer.periods.includes('morning') && (
                  <div className="flex items-center mr-4">
                    <Sun className="h-4 w-4 mr-1 text-yellow-500" />
                    Matin
                  </div>
                )}
                {offer.periods.includes('afternoon') && (
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-1 text-blue-500" />
                    Après-midi
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Branches */}
          {offer.subjects && offer.subjects.length > 1 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Branches à enseigner</h3>
              <div className="flex flex-wrap gap-2">
                {offer.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Informations utiles */}
          {offer.topic && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Informations utiles</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{offer.topic}</p>
            </div>
          )}

          {/* Qualifications */}
          {offer.qualifications && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-primary">
                Qualifications souhaitées
              </h3>
              <p className="text-gray-600">{offer.qualifications}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg flex justify-end">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Fermer
            </button>
            {!hideApplyButton && onApply && status === 'active' && (
              <button
                onClick={onApply}
                className="btn btn-primary"
              >
                Postuler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}