import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/context/AuthContext'
import { notifyApplicationAccepted, notifyApplicationRejected } from '../lib/services/notifications'
import ApplicationCard from '../components/applications/ApplicationCard'
import { useApplications } from '../hooks/useApplications'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { rejectOtherApplications } from '../lib/services/applications'
import { CheckCircle, Clock, Eye } from 'lucide-react'
import OfferDetailsModal from '../components/teachers/OfferDetailsModal'
import { getSubjectsDisplay } from '../lib/utils/subjects'

type GroupedApplications = {
  [offerId: string]: {
    offer: {
      subject: string
      class: string
      location: string
      startDate: string
      endDate: string
      totalLessons: number
      teachingLevel: string
      topic?: string
      qualifications?: string
      subjects?: string[]
    }
    applications: any[]
    hasAcceptedApplication: boolean
  }
}

export function SchoolApplications() {
  const { user } = useAuth()
  const [schoolData, setSchoolData] = useState<any>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { applications, loading, error: applicationsError, refresh } = useApplications(user?.uid)
  const [groupedApplications, setGroupedApplications] = useState<GroupedApplications>({})
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadSchoolData()
    }
  }, [user])

  useEffect(() => {
    if (applications) {
      groupApplicationsByOffer()
    }
  }, [applications])

  async function loadSchoolData() {
    try {
      const schoolDoc = await getDoc(doc(db, 'schools', user!.uid))
      if (schoolDoc.exists()) {
        setSchoolData(schoolDoc.data())
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'école:', err)
      setError('Erreur lors du chargement des données')
    }
  }

  function groupApplicationsByOffer() {
    const grouped: GroupedApplications = {}
    
    applications.forEach(application => {
      if (!application.offer) return

      const offerId = application.offerId
      if (!grouped[offerId]) {
        grouped[offerId] = {
          offer: application.offer,
          applications: [],
          hasAcceptedApplication: false
        }
      }
      grouped[offerId].applications.push(application)
      
      if (application.status === 'accepted') {
        grouped[offerId].hasAcceptedApplication = true
      }
    })

    setGroupedApplications(grouped)
  }

  async function handleAcceptApplication(applicationId: string, offerId: string, teacherId: string, subject: string) {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: 'accepted'
      })

      await updateDoc(doc(db, 'replacement-offers', offerId), {
        status: 'filled'
      })

      await notifyApplicationAccepted(teacherId, schoolData.name, subject)
      await rejectOtherApplications(applicationId, offerId)
      
      setSuccessMessage('Candidature acceptée avec succès !')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      await refresh()
    } catch (err) {
      console.error('Erreur lors de l\'acceptation de la candidature:', err)
      setError('Erreur lors de l\'acceptation de la candidature')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || applicationsError) {
    return <div className="text-red-500">{error || applicationsError}</div>
  }

  if (Object.keys(groupedApplications).length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Candidatures reçues</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          Aucune candidature reçue
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Candidatures reçues</h1>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedApplications).map(([offerId, { offer, applications, hasAcceptedApplication }]) => (
          <div key={offerId} className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-primary">
                    {getSubjectsDisplay(offer.subjects || [])} - {offer.class}
                  </h2>
                  {hasAcceptedApplication ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Pourvu
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      <Clock className="h-4 w-4 mr-1" />
                      Ouvert
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOffer({
                    ...offer,
                    schoolId: user?.uid,
                    schoolName: schoolData?.name
                  })}
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onAccept={handleAcceptApplication}
                  schoolName={schoolData?.name || ''}
                  isOfferFilled={hasAcceptedApplication}
                />
              ))}
            </div>
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