import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc, orderBy, DocumentData } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Application } from '../types/application'

export function useApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplications = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      // Récupérer les candidatures pour l'école
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('schoolId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const applicationsSnapshot = await getDocs(applicationsQuery)
      
      const applicationsData = await Promise.all(
        applicationsSnapshot.docs.map(async (applicationDoc) => {
          const applicationData = applicationDoc.data()
          
          try {
            // Récupérer les données du remplaçant
            const teacherDoc = await getDoc(doc(db, 'teachers', applicationData.teacherId))
            const teacherData = teacherDoc.exists() ? teacherDoc.data() : null

            // Récupérer les données de l'offre
            const offerDoc = await getDoc(doc(db, 'replacement-offers', applicationData.offerId))
            const offerData = offerDoc.exists() ? offerDoc.data() : null

            if (!teacherData || !offerData) {
              return null
            }

            return {
              id: applicationDoc.id,
              teacherId: applicationData.teacherId,
              offerId: applicationData.offerId,
              schoolId: applicationData.schoolId,
              message: applicationData.message,
              status: applicationData.status,
              createdAt: applicationData.createdAt?.toDate(),
              teacher: {
                firstName: teacherData.firstName,
                lastName: teacherData.lastName,
                email: teacherData.email,
                teachingLevels: teacherData.teachingLevels,
                subjects: teacherData.subjects,
                photoUrl: teacherData.photoUrl,
                cvUrl: teacherData.cvUrl
              },
              offer: {
                subjects: offerData.subjects || [],
                class: offerData.class,
                location: offerData.location,
                startDate: offerData.startDate,
                endDate: offerData.endDate,
                totalLessons: offerData.totalLessons,
                teachingLevel: offerData.teachingLevel,
                topic: offerData.topic,
                qualifications: offerData.qualifications
              }
            } as Application
          } catch (err) {
            console.error('Erreur lors de la récupération des détails:', err)
            return null
          }
        })
      )

      setApplications(applicationsData.filter((app): app is Application => app !== null))
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement des candidatures:', err)
      setError('Erreur lors du chargement des candidatures')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [userId])

  return {
    applications,
    loading,
    error,
    refresh: loadApplications
  }
}