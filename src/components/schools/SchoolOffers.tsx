import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import ApplicationModal from '../teachers/ApplicationModal'
import OfferDetailsModal from '../teachers/OfferDetailsModal'
import { MapPin, Calendar, Clock, School, Send, Eye, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { calculateOfferStatus } from '../../lib/utils/offerStatus'
import { StatusBadge } from '../ui/StatusBadge'
import { getSubjectsDisplay } from '../../lib/utils/subjects'
import { useTranslation } from '../../lib/context/LanguageContext'
import { useContext } from 'react'
import { LanguageContext } from '../../lib/context/LanguageContext'
import { getDateLocale } from '../../lib/utils/dateLocale'

interface SchoolOffersProps {
  schoolId: string
  schoolName: string
}

export function SchoolOffers({ schoolId, schoolName }: SchoolOffersProps) {
  const { t } = useTranslation()
  const { language } = useContext(LanguageContext)
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  
  const dateLocale = getDateLocale(language)

  useEffect(() => {
    loadOffers()
  }, [schoolId])

  async function loadOffers() {
    try {
      setLoading(true)
      const offersQuery = query(
        collection(db, 'replacement-offers'),
        where('schoolId', '==', schoolId),
        where('status', '==', 'active')
      )
      const snapshot = await getDocs(offersQuery)
      const offersData = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          schoolId,
          schoolName,
          status: calculateOfferStatus(data.endDate, data.status)
        }
      })

      // Filtrer pour ne garder que les offres actives
      const activeOffers = offersData.filter(offer => offer.status === 'active')
      setOffers(activeOffers)
    } catch (err) {
      console.error('Error loading offers:', err)
      setError(t('schoolOffers.errorLoad'))
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (offer: any) => {
    setSelectedOffer(offer)
  }

  const handleApply = (offer: any) => {
    setSelectedOffer(offer)
    setShowApplicationModal(true)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
        {t('common.noResults')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="card p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {getSubjectsDisplay(offer.subjects)} - {offer.class}
              </h3>
              <StatusBadge 
                status={offer.status} 
                isUrgent={offer.isUrgent}
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {offer.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(offer.startDate), 'EEEE d MMMM yyyy', { locale: dateLocale })}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {offer.totalLessons} {t('teacherApplications.lessons')}
              </div>
              {offer.periods && offer.periods.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {offer.periods.includes('morning') && (
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-1 text-yellow-500" />
                      {t('school.registration.morning')}
                    </div>
                  )}
                  {offer.periods.includes('afternoon') && (
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-1 text-blue-500" />
                      {t('school.registration.afternoon')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {offer.topic && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium mb-1">{t('schoolOffers.usefulInfo')}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {offer.topic}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleViewDetails(offer)}
                className="flex items-center text-primary hover:text-primary-dark"
              >
                <Eye className="h-4 w-4 mr-1" />
                {t('common.details')}
              </button>
              <button
                onClick={() => handleApply(offer)}
                className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                <span>{t('common.apply')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOffer && !showApplicationModal && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onApply={() => setShowApplicationModal(true)}
        />
      )}

      {showApplicationModal && selectedOffer && (
        <ApplicationModal
          offer={selectedOffer}
          onClose={() => {
            setShowApplicationModal(false)
            setSelectedOffer(null)
          }}
          onSuccess={() => {
            setShowApplicationModal(false)
            setSelectedOffer(null)
          }}
        />
      )}
    </div>
  )
}