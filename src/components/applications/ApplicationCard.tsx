import { useState } from 'react'
import { MessageCircle, Eye, FileText, ExternalLink, AlertCircle, UserCircle2 } from 'lucide-react'
import { Application } from '../../types/application'
import { findOrCreateConversation } from '../../lib/services/messages'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../lib/context/LanguageContext'
import { TeacherProfileModal } from '../teachers/TeacherProfileModal'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getSubjectsDisplay } from '../../lib/utils/subjects'

interface ApplicationCardProps {
  application: Application
  onAccept: (applicationId: string, offerId: string, teacherId: string, subject: string) => void
  schoolName: string
  isOfferFilled?: boolean
}

export const ApplicationCard = ({ application, onAccept, schoolName, isOfferFilled }: ApplicationCardProps) => {
  const { t } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [teacherFullProfile, setTeacherFullProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [acceptingApplication, setAcceptingApplication] = useState(false)
  const navigate = useNavigate()

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return format(start, 'EEEE d MMMM yyyy', { locale: fr })
    }
    
    return `${t('common.from')} ${format(start, 'd MMMM', { locale: fr })} ${t('common.to')} ${format(end, 'd MMMM yyyy', { locale: fr })}`
  }

  const handleShowProfile = async () => {
    if (!application.teacher) return

    setLoadingProfile(true)
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', application.teacherId))
      if (teacherDoc.exists()) {
        setTeacherFullProfile(teacherDoc.data())
      }
    } catch (error) {
      console.error(t('teacher.profile.loadError'), error)
    }
    setLoadingProfile(false)
    setShowProfile(true)
  }

  const handleMessage = async () => {
    if (isCreatingConversation || !application.teacher) return
    
    try {
      setIsCreatingConversation(true)
      const conversationId = await findOrCreateConversation({
        participants: {
          [application.teacherId]: true,
          [application.schoolId]: true
        },
        metadata: {
          teacherId: application.teacherId,
          teacherName: `${application.teacher.firstName} ${application.teacher.lastName}`,
          schoolId: application.schoolId,
          schoolName: schoolName,
          offerId: application.offerId,
          offerSubject: getSubjectsDisplay(application.offer?.subjects || [])
        },
        type: 'teacher_school',
        lastMessageAt: new Date(),
        unreadCount: {
          [application.teacherId]: 0,
          [application.schoolId]: 0
        }
      })

      navigate(`/messages?conversation=${conversationId}`)
    } catch (error) {
      console.error(t('messages.createError'), error)
    } finally {
      setIsCreatingConversation(false)
    }
  }

  const handleAcceptClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmAccept = async () => {
    setAcceptingApplication(true)
    try {
      await onAccept(
        application.id,
        application.offerId,
        application.teacherId,
        getSubjectsDisplay(application.offer?.subjects || [])
      )
      setShowConfirmation(false)
      application.status = 'accepted'
    } finally {
      setAcceptingApplication(false)
    }
  }

  if (!application.teacher || !application.offer) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500">
          {t('school.applications.detailsUnavailable')}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {application.teacher.photoUrl ? (
                <img
                  src={application.teacher.photoUrl}
                  alt={`${application.teacher.firstName} ${application.teacher.lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserCircle2 className="h-16 w-16 text-gray-300" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {application.teacher.firstName} {application.teacher.lastName}
              </h3>
              <p className="text-sm text-gray-500">{application.teacher.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDateRange(application.offer.startDate, application.offer.endDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-4">
            <button
              onClick={handleShowProfile}
              disabled={loadingProfile}
              className="flex items-center space-x-2 text-primary hover:text-primary/90"
            >
              <Eye className="h-5 w-5" />
              <span>{loadingProfile ? t('common.loading') : t('school.applications.actions.viewProfile')}</span>
            </button>

            {application.teacher.cvUrl && (
              <a
                href={application.teacher.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary hover:text-primary/90"
              >
                <FileText className="h-5 w-5" />
                <span>{t('school.applications.actions.downloadCV')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            <button
              onClick={handleMessage}
              disabled={isCreatingConversation}
              className="flex items-center space-x-2 text-primary hover:text-primary/90"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isCreatingConversation ? t('common.loading') : t('school.applications.actions.message')}</span>
            </button>

            {application.status === 'accepted' ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {t('school.applications.status.accepted')}
              </span>
            ) : isOfferFilled ? (
              <div className="text-gray-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {t('school.applications.status.positionFilled')}
              </div>
            ) : (
              <button
                onClick={handleAcceptClick}
                disabled={acceptingApplication}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {acceptingApplication ? t('common.loading') : t('school.applications.actions.accept')}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {t('school.applications.candidateMessage')}
          </h4>
          <p className="text-gray-600">{application.message}</p>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">{t('school.applications.confirmAcceptTitle')}</h3>
            <p className="text-gray-600 mb-6">
              {t('school.applications.confirmAcceptMessage')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirmAccept}
                disabled={acceptingApplication}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {acceptingApplication ? t('common.loading') : t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && teacherFullProfile && (
        <TeacherProfileModal
          teacher={{
            ...teacherFullProfile,
            city: teacherFullProfile.address?.city,
            canton: teacherFullProfile.canton
          }}
          onClose={() => {
            setShowProfile(false)
            setTeacherFullProfile(null)
          }}
        />
      )}
    </>
  )
}

export default ApplicationCard