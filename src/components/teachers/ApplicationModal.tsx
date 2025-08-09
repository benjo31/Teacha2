import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, MessageCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { applicationSchema } from '../../lib/schemas/application'
import { createApplication } from '../../lib/services/applications'
import { notifyNewApplication } from '../../lib/services/notifications'
import { findOrCreateConversation } from '../../lib/services/messages'
import { useAuth } from '../../lib/context/AuthContext'
import { useTranslation } from '../../lib/context/LanguageContext'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getSubjectsDisplay } from '../../lib/utils/subjects'

type ApplicationFormData = z.infer<typeof applicationSchema>

interface ApplicationModalProps {
  offer: {
    id: string
    schoolId: string
    subjects?: string[]
    class: string
    location: string
    startDate: string
  }
  onClose: () => void
  onSuccess: () => void
}

export default function ApplicationModal({ offer, onClose, onSuccess }: ApplicationModalProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)
  const [isCheckingApplication, setIsCheckingApplication] = useState(true)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      teacherId: user?.uid,
      offerId: offer.id,
      schoolId: offer.schoolId,
      status: 'pending'
    }
  })

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user) return

      try {
        const applicationsRef = collection(db, 'applications')
        const q = query(
          applicationsRef,
          where('teacherId', '==', user.uid),
          where('offerId', '==', offer.id)
        )
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const applicationData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
          }
          setExistingApplication(applicationData)
        }
      } catch (err) {
        console.error('Error checking application:', err)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    checkExistingApplication()
  }, [user, offer.id])

  const handleMessage = async () => {
    if (!user || isProcessing) return

    try {
      setIsProcessing(true)
      setError('')

      // Récupérer les données du remplaçant
      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      const schoolDoc = await getDoc(doc(db, 'schools', offer.schoolId))
      
      if (!teacherDoc.exists() || !schoolDoc.exists()) {
        throw new Error(t('applicationModal.errors.userDataNotFound'))
      }

      const teacherData = teacherDoc.data()
      const schoolData = schoolDoc.data()

      // Create or retrieve conversation
      const conversationId = await findOrCreateConversation({
        participants: {
          [user.uid]: true,
          [offer.schoolId]: true
        },
        type: 'teacher_school',
        metadata: {
          teacherId: user.uid,
          teacherName: `${teacherData.firstName} ${teacherData.lastName}`,
          schoolId: offer.schoolId,
          schoolName: schoolData.name,
          offerId: offer.id,
          offerSubject: getSubjectsDisplay(offer.subjects || [])
        },
        lastMessageAt: new Date(),
        unreadCount: {}
      })

      navigate(`/messages?conversation=${conversationId}`)
    } catch (error: any) {
      console.error('Error creating conversation:', error)
      setError(error.message || t('applicationModal.errors.conversationCreation'))
    } finally {
      setIsProcessing(false)
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (isProcessing) return

    try {
      setIsProcessing(true)
      setError('')

      // Vérifier si l'utilisateur est connecté
      if (!user) {
        throw new Error(t('applicationModal.errors.connectionRequired'))
      }

      // Vérifier si l'utilisateur est un remplaçant approuvé
      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      if (!teacherDoc.exists()) {
        throw new Error(t('applicationModal.errors.profileNotFound'))
      }
      
      const teacherData = teacherDoc.data()
      if (teacherData.status !== 'approved') {
        throw new Error(t('applicationModal.errors.approvalRequired'))
      }

      // Create application
      await createApplication(data)

      // Récupérer les données de l'école
      const schoolDoc = await getDoc(doc(db, 'schools', offer.schoolId))
      if (!schoolDoc.exists()) {
        throw new Error(t('applicationModal.errors.schoolNotFound'))
      }

      // Create or retrieve conversation
      const conversationId = await findOrCreateConversation({
        participants: {
          [user.uid]: true,
          [offer.schoolId]: true
        },
        type: 'teacher_school',
        metadata: {
          teacherId: user.uid,
          teacherName: `${teacherData.firstName} ${teacherData.lastName}`,
          schoolId: offer.schoolId,
          schoolName: schoolDoc.data().name,
          offerId: offer.id,
          offerSubject: getSubjectsDisplay(offer.subjects || [])
        },
        lastMessageAt: new Date(),
        unreadCount: {}
      })

      // Envoyer la notification à l'école
      await notifyNewApplication(
        offer.schoolId,
        `${teacherData.firstName} ${teacherData.lastName}`,
        getSubjectsDisplay(offer.subjects || [])
      )

      // Attendre un peu pour s'assurer que tout est créé
      await new Promise(resolve => setTimeout(resolve, 500))

      onSuccess()
      onClose()
      
      // Rediriger vers la conversation
      navigate(`/messages?conversation=${conversationId}`)
    } catch (err: any) {
      console.error('Error submitting application:', err)
      if (err.code === 'permission-denied') {
        setError(t('applicationModal.errors.permissionDenied'))
      } else {
        setError(err.message || t('applicationModal.errors.general'))
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewApplication = () => {
    navigate('/teacher-applications')
    onClose()
  }

  if (isCheckingApplication) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">{t('applicationModal.checkingApplication')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (existingApplication) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {t('applicationModal.existingApplicationTitle')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{t('applicationModal.alreadyApplied')}</p>
            </div>

            <p className="text-gray-600 mb-6">
              {t('applicationModal.existingApplicationMessage')}
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleViewApplication}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('applicationModal.viewApplication')}
              </button>

              <button
                onClick={handleMessage}
                disabled={isProcessing}
                className="flex items-center justify-center space-x-2 text-primary hover:text-primary-dark w-full border border-primary/20 rounded-lg p-2 hover:bg-primary/5"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isProcessing ? t('applicationModal.loading') : t('applicationModal.sendMessage')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {t('applicationModal.applyTitle')} - {getSubjectsDisplay(offer.subjects || [])}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">{t('applicationModal.schoolAt', { location: offer.location })}</p>
              <p className="text-sm text-gray-600">
                {format(new Date(offer.startDate), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <button
              onClick={handleMessage}
              disabled={isProcessing}
              className="flex items-center space-x-2 text-primary hover:text-primary/90 disabled:opacity-50"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isProcessing ? t('applicationModal.loading') : t('applicationModal.message')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('applicationModal.yourMessage')}
              </label>
              <textarea
                {...register('message')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                rows={4}
                placeholder={t('applicationModal.messagePlaceholder')}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                {t('applicationModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isProcessing}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting || isProcessing ? t('applicationModal.sending') : t('applicationModal.sendApplication')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}