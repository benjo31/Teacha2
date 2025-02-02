import { useAuth } from '../lib/context/AuthContext'
import { MapPin, School, MessageCircle, CheckCircle, XCircle, Trash2, Eye, Clock } from 'lucide-react'
import { useTeacherApplications } from '../hooks/useTeacherApplications'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { findOrCreateConversation } from '../lib/services/messages'
import { useNavigate } from 'react-router-dom'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useState } from 'react'
import OfferDetailsModal from '../components/teachers/OfferDetailsModal'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getSubjectsDisplay } from '../lib/utils/subjects'

export function TeacherApplications() {
  const { user } = useAuth()
  const { applications, loading, error, refresh } = useTeacherApplications(user?.uid)
  const [withdrawing, setWithdrawing] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const navigate = useNavigate()

  const handleMessage = async (application: any) => {
    try {
      const conversationData = {
        participants: {
          [application.teacherId]: true,
          [application.schoolId]: true
        },
        type: 'teacher_school' as const,
        metadata: {
          teacherId: application.teacherId,
          teacherName: user?.displayName || 'Remplaçant',
          schoolId: application.schoolId,
          schoolName: application.schoolName || 'École',
          offerId: application.offerId,
          offerSubject: getSubjectsDisplay(application.offer?.subjects || [])
        },
        lastMessageAt: new Date(),
        unreadCount: {
          [application.teacherId]: 0,
          [application.schoolId]: 0
        }
      }

      const conversationId = await findOrCreateConversation(conversationData)
      navigate(`/messages?conversation=${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer votre candidature ?')) {
      return
    }

    try {
      setWithdrawing(applicationId)
      await deleteDoc(doc(db, 'applications', applicationId))
      await refresh()
    } catch (error) {
      console.error('Erreur lors du retrait de la candidature:', error)
    } finally {
      setWithdrawing(null)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return format(start, 'EEEE d MMMM yyyy', { locale: fr })
    }
    
    return `Du ${format(start, 'd MMMM', { locale: fr })} au ${format(end, 'd MMMM yyyy', { locale: fr })}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Candidature acceptée</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center text-gray-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Remplacement pourvu</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center text-yellow-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">En attente</span>
          </span>
        )
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mes candidatures</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          Vous n'avez pas encore postulé à des remplacements
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes candidatures</h1>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="card p-6 hover:shadow-lg transition-all duration-200"
          >
            {application.offer ? (
              <div className="flex flex-col h-full">
                {/* En-tête avec statut */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    {getSubjectsDisplay(application.offer.subjects || [])} - {application.offer.class}
                  </h3>
                  {getStatusBadge(application.status)}
                </div>

                {/* Informations de l'offre */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-gray-600 text-sm">
                    <School className="h-4 w-4 mr-2 flex-shrink-0" />
                    {application.schoolName || 'École'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    {application.offer.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    {formatDateRange(application.offer.startDate, application.offer.endDate)}
                  </div>
                </div>

                {/* Message de candidature */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                  <p className="text-gray-600">{application.message}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMessage(application)}
                      className="flex items-center text-primary hover:text-primary-dark"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </button>

                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        disabled={withdrawing === application.id}
                        className="flex items-center text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {withdrawing === application.id ? 'Retrait...' : 'Retirer'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedOffer(application.offer)}
                    className="flex items-center text-primary hover:text-primary-dark"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Cette offre n'est plus disponible
              </div>
            )}
          </div>
        ))}
      </div>

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

export default TeacherApplications