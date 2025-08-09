import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { MapPin, Calendar, Clock, School, Send, Eye, Sun, Moon } from 'lucide-react'
import ApplicationModal from './ApplicationModal'
import OfferDetailsModal from './OfferDetailsModal'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { StatusBadge } from '../ui/StatusBadge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getActiveOffers } from '../../lib/services/offers'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { normalizeString } from '../../lib/utils'
import { calculateOfferStatus } from '../../lib/utils/offerStatus'
import { OffersFilter } from './OffersFilter'
import { useFavoriteSchools } from '../../hooks/useFavoriteSchools'
import { FavoriteSchoolButton } from './FavoriteSchoolButton'
import { getSubjectsDisplay } from '../../lib/utils/subjects'
import { useTranslation } from '../../lib/context/LanguageContext'

export function AvailableOffersList() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [locationSearch, setLocationSearch] = useState('')
  const [userCity, setUserCity] = useState<string>('')
  const [localOffersEnabled, setLocalOffersEnabled] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favoriteSchools, toggleFavorite } = useFavoriteSchools(user?.uid)

  useEffect(() => {
    if (user) {
      loadUserData()
      loadOffers()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      if (teacherDoc.exists()) {
        const data = teacherDoc.data()
        if (data.address?.city) {
          setUserCity(data.address.city)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  async function loadOffers() {
    try {
      setLoading(true)
      setError('')
      const activeOffers = await getActiveOffers()
      
      const offersWithStatus = activeOffers.map(offer => ({
        ...offer,
        status: calculateOfferStatus(offer.endDate, offer.status)
      }))
      
      const filteredOffers = offersWithStatus.filter(offer => offer.status === 'active')
      
      setOffers(filteredOffers)
    } catch (err) {
      console.error('Error loading offers:', err)
      setError(t('availableOffersList.errorLoad'))
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (offer: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setSelectedOffer(offer)
  }

  const handleApply = (offer: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOffer(offer)
    setShowApplicationModal(true)
  }

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false)
    setSelectedOffer(null)
    loadOffers()
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSubjects = selectedSubjects.length === 0 || 
      offer.subjects.some(subject => selectedSubjects.includes(subject))

    const matchesLevels = selectedLevels.length === 0 || 
      selectedLevels.includes(offer.teachingLevel)

    const matchesLocation = !locationSearch || 
      normalizeString(offer.location).includes(normalizeString(locationSearch))

    const matchesFavorites = !showFavoritesOnly || 
      favoriteSchools.includes(offer.schoolId)

    return matchesSubjects && matchesLevels && matchesLocation && matchesFavorites
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        {error}
      </div>
    )
  }

  return (
    <div>
      <OffersFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSubjects={selectedSubjects}
        onSubjectsChange={setSelectedSubjects}
        selectedLevels={selectedLevels}
        onLevelsChange={setSelectedLevels}
        locationSearch={locationSearch}
        onLocationChange={setLocationSearch}
        userCity={userCity}
        localOffersEnabled={localOffersEnabled}
        onLocalOffersChange={setLocalOffersEnabled}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesChange={setShowFavoritesOnly}
      />

      {filteredOffers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('availableOffersList.noMatchingOffers')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="card p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {getSubjectsDisplay(offer.subjects)} - {offer.class}
                </h3>
                <div className="flex items-center gap-2">
                  <FavoriteSchoolButton
                    teacherId={user?.uid || ''}
                    schoolId={offer.schoolId}
                    isFavorite={favoriteSchools.includes(offer.schoolId)}
                    onToggle={(isFavorite) => toggleFavorite(offer.schoolId, isFavorite)}
                  />
                  <StatusBadge status={offer.status} isUrgent={offer.isUrgent} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <School className="h-4 w-4 mr-2" />
                  {offer.schoolName}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {offer.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(offer.startDate), 'EEEE d MMMM yyyy', { locale: fr })}
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
                  onClick={(e) => handleViewDetails(offer, e)}
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('common.details')}
                </button>
                {offer.status === 'active' && (
                  <button
                    onClick={(e) => handleApply(offer, e)}
                    className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t('common.apply')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}