import { useAuth } from '../../lib/context/AuthContext'
import { MapPin, Calendar, Clock, School, MessageCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { useTeacherApplications } from '../../hooks/useTeacherApplications'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { createConversation } from '../../lib/services/messages'
import { useNavigate } from 'react-router-dom'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from '../../lib/context/LanguageContext'

export default function TeacherApplications() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { applications, loading, error, refresh } = useTeacherApplications(user?.uid)
  const navigate = useNavigate()
  const [withdrawing, setWithdrawing] = useState<string | null>(null)

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
          teacherName: `${application.teacher?.firstName} ${application.teacher?.lastName}`,
          schoolId: application.schoolId,
          schoolName: application.schoolName || t('teacherApplications.schoolDefault'),
          offerId: application.offerId,
          offerSubject: application.offer?.subject
        },
        lastMessageAt: new Date(),
        unreadCount: {}
      }

      const conversationId = await createConversation(conversationData)
      navigate(`/messages?conversation=${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm(t('teacherApplications.confirmWithdraw'))) {
      return
    }

    try {
      setWithdrawing(applicationId)
      await deleteDoc(doc(db, 'applications', applicationId))
      await refresh()
    } catch (error) {
      console.error('Error withdrawing application:', error)
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
    
    return `${t('teacherApplications.dateFrom')} ${format(start, 'd MMMM', { locale: fr })} ${t('teacherApplications.dateTo')} ${format(end, 'd MMMM yyyy', { locale: fr })}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">{t('teacherApplications.status.accepted')}</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center text-gray-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">{t('teacherApplications.status.rejected')}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center text-yellow-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{t('teacherApplications.status.pending')}</span>
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('teacherApplications.title')}</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          {t('teacherApplications.empty')}
        </div>
      </div>
    )
  }

  console.log('Applications brutes:', applications);
  console.log('Application exemple:', applications[0]);
  if (applications[0]?.offer) {
    console.log('Données de l\'offre:', applications[0].offer);
    console.log('StartDate:', applications[0].offer.startDate);
    console.log('EndDate:', applications[0].offer.endDate);
    console.log('TotalLessons:', applications[0].offer.totalLessons);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes candidatures</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {application.offer.subject} - {application.offer.class}
                  </h3>
                  {getStatusBadge(application.status)}
                </div>

                {/* Informations de l'offre */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-gray-600 text-sm">
                    <School className="h-4 w-4 mr-2 flex-shrink-0" />
                    {application.schoolName || t('teacherApplications.schoolDefault')}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    {application.offer.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    {formatDateRange(application.offer.startDate, application.offer.endDate)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    {application.offer.totalLessons} {t('teacherApplications.lessons')}
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
                      {t('teacherApplications.message')}
                    </button>

                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        disabled={withdrawing === application.id}
                        className="flex items-center text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {withdrawing === application.id ? t('teacherApplications.withdrawing') : t('teacherApplications.withdraw')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                {t('teacherApplications.offerUnavailable')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}