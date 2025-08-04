import { useState, useEffect } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { findOrCreateConversation } from '../lib/services/messages'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MessageCircle, Eye, UserCircle2 } from 'lucide-react'
import OfferDetailsModal from '../components/teachers/OfferDetailsModal'
import { getSubjectsDisplay } from '../lib/utils/subjects'
import { useTranslation } from '../lib/context/LanguageContext'

type HistoryEntry = {
  id: string
  teacherId: string
  teacher: {
    firstName: string
    lastName: string
    photoUrl?: string
  }
  offer: {
    subject: string
    class: string
    location: string
    startDate: string
    endDate: string
    totalLessons: number
    subjects?: string[]
  }
  status: string
  createdAt: any
}

export function SchoolReplacementsHistory() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [schoolData, setSchoolData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadHistory()
      loadSchoolData()
    }
  }, [user])

  async function loadSchoolData() {
    if (!user) return
    try {
      const schoolDoc = await getDoc(doc(db, 'schools', user.uid))
      if (schoolDoc.exists()) {
        setSchoolData(schoolDoc.data())
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'école:', err)
    }
  }

  async function loadHistory() {
    if (!user) return
    
    try {
      setLoading(true)
      setError('')

      // Récupérer toutes les candidatures acceptées
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('schoolId', '==', user.uid),
        where('status', '==', 'accepted'),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(applicationsQuery)
      
      // Traiter chaque candidature
      const historyPromises = snapshot.docs.map(async (applicationDoc) => {
        const applicationData = applicationDoc.data()
        
        try {
          // Récupérer les données du remplaçant
          const teacherDoc = await getDoc(doc(db, 'teachers', applicationData.teacherId))
          if (!teacherDoc.exists()) {
            console.warn(`Teacher ${applicationData.teacherId} not found`)
            return null
          }
          const teacherData = teacherDoc.data()

          // Récupérer les données de l'offre
          const offerDoc = await getDoc(doc(db, 'replacement-offers', applicationData.offerId))
          if (!offerDoc.exists()) {
            console.warn(`Offer ${applicationData.offerId} not found`)
            return null
          }
          const offerData = offerDoc.data()

          return {
            id: applicationDoc.id,
            teacherId: applicationData.teacherId,
            teacher: {
              firstName: teacherData.firstName,
              lastName: teacherData.lastName,
              photoUrl: teacherData.photoUrl
            },
            offer: {
              subject: offerData.subject,
              class: offerData.class,
              location: offerData.location,
              startDate: offerData.startDate,
              endDate: offerData.endDate,
              totalLessons: offerData.totalLessons,
              subjects: offerData.subjects
            },
            status: applicationData.status,
            createdAt: applicationData.createdAt
          }
        } catch (err) {
          console.error('Erreur lors du chargement des détails:', err)
          return null
        }
      })

      const historyResults = await Promise.all(historyPromises)
      const validHistory = historyResults.filter((entry): entry is HistoryEntry => entry !== null)
      
      setHistory(validHistory)
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err)
      setError('Une erreur est survenue lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = async (entry: HistoryEntry) => {
    if (isCreatingConversation || !user || !schoolData) return
    
    try {
      setIsCreatingConversation(true)
      setError('')

      const conversationId = await findOrCreateConversation({
        metadata: {
          teacherId: entry.teacherId,
          teacherName: `${entry.teacher.firstName} ${entry.teacher.lastName}`,
          schoolId: user.uid,
          schoolName: schoolData.name,
          offerSubject: getSubjectsDisplay(entry.offer.subjects || [])
        },
        type: 'teacher_school',
        lastMessageAt: new Date(),
        unreadCount: {}
      })

      navigate(`/messages?conversation=${conversationId}`)
    } catch (error) {
      console.error('Erreur lors de la création/récupération de la conversation:', error)
      setError(t('schoolHistory.errorConversation'))
    } finally {
      setIsCreatingConversation(false)
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('schoolHistory.title')}</h1>

      {history.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          {t('schoolHistory.noReplacements')}
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {/* Photo de profil */}
                  <div className="flex-shrink-0">
                    {entry.teacher.photoUrl ? (
                      <img
                        src={entry.teacher.photoUrl}
                        alt={`${entry.teacher.firstName} ${entry.teacher.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle2 className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {getSubjectsDisplay(entry.offer.subjects || [])} - {entry.offer.class}
                    </h3>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>
                        {entry.teacher.firstName} {entry.teacher.lastName}
                      </p>
                      <p>
                        {format(new Date(entry.offer.startDate), 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                      <p>{entry.offer.totalLessons} {t('schoolHistory.lessons')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMessage(entry)}
                    disabled={isCreatingConversation}
                    className="flex items-center text-primary hover:text-primary-dark"
                  >
                    <MessageCircle className="h-5 w-5 mr-1" />
                    {t('schoolHistory.message')}
                  </button>
                  <button
                    onClick={() => setSelectedOffer({
                      ...entry.offer,
                      schoolId: user?.uid,
                      teachingLevel: entry.offer.class
                    })}
                    className="flex items-center text-primary hover:text-primary-dark"
                  >
                    <Eye className="h-5 w-5 mr-1" />
                    {t('schoolHistory.details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          hideApplyButton
        />
      )}
    </div>
  )
}

export default SchoolReplacementsHistory