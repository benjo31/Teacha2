import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../lib/context/AuthContext'
import { MapPin, Calendar, Clock, School, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { StatusBadge } from '../ui/StatusBadge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import OfferDetailsModal from '../teachers/OfferDetailsModal'
import { EditOfferModal } from './EditOfferModal'
import { calculateOfferStatus } from '../../lib/utils/offerStatus'
import { getSubjectsDisplay } from '../../lib/utils/subjects'
import { useTranslation } from '../../lib/context/LanguageContext'

export function OffersList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [editingOffer, setEditingOffer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  useEffect(() => {
    if (user) {
      loadOffers()
    }
  }, [user])

  async function loadOffers() {
    try {
      setLoading(true)
      const offersQuery = query(
        collection(db, 'replacement-offers'),
        where('schoolId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(offersQuery)
      const offersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOffers(offersData)
    } catch (err) {
      console.error('Error loading offers:', err)
      setError(t('school.offers.errorLoad'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (offerId: string) => {
    if (!window.confirm(t('confirm.delete'))) {
      return
    }

    try {
      await deleteDoc(doc(db, 'replacement-offers', offerId))
      await loadOffers() // Reload the list
    } catch (err) {
      console.error('Error deleting offer:', err)
      setError(t('errors.general'))
    }
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = searchTerm === '' || 
      offer.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.class?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = selectedSubject === '' || 
      offer.subject === selectedSubject

    return matchesSearch && matchesSubject
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div>
      {/* Filtres */}
      <div className="mb-8 space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('school.offers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Liste des offres */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('common.noResults')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {getSubjectsDisplay(offer.subjects)} - {offer.class}
                </h3>
                <StatusBadge 
                  status={calculateOfferStatus(offer.endDate, offer.status)} 
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
                  {format(new Date(offer.startDate), 'EEEE d MMMM yyyy', { locale: fr })}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {offer.totalLessons} {t('teacherApplications.lessons')}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="text-primary hover:text-primary-dark"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setEditingOffer(offer)}
                  className="text-primary hover:text-primary-dark"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          hideApplyButton
        />
      )}

      {editingOffer && (
        <EditOfferModal
          offer={editingOffer}
          onClose={() => setEditingOffer(null)}
          onSuccess={loadOffers}
        />
      )}
    </div>
  )
}