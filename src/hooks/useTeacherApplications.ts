import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Application } from '../types/application'

export function useTeacherApplications(teacherId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplications = async () => {
    if (!teacherId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      // Récupérer toutes les candidatures du remplaçant
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(applicationsQuery)
      
      const applicationsData = await Promise.all(
        snapshot.docs.map(async (applicationDoc) => {
          const applicationData = applicationDoc.data()
          
          try {
            // Récupérer les données de l'offre
            const offerDoc = await getDoc(doc(db, 'replacement-offers', applicationData.offerId))
            const offerData = offerDoc.exists() ? offerDoc.data() : null

            // Récupérer les données de l'école
            const schoolDoc = await getDoc(doc(db, 'schools', applicationData.schoolId))
            const schoolData = schoolDoc.exists() ? schoolDoc.data() : null

            if (!offerData || !schoolData) {
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
              schoolName: schoolData.name,
              offer: {
                subject: offerData.subject,
                class: offerData.class,
                location: offerData.location,
                startDate: offerData.startDate,
                endDate: offerData.endDate,
                totalLessons: offerData.totalLessons,
                teachingLevel: offerData.teachingLevel,
                topic: offerData.topic,
                qualifications: offerData.qualifications,
                subjects: offerData.subjects
              }
            } as Application
          } catch (err) {
            console.error('Erreur lors de la récupération des détails:', err)
            return null
          }
        })
      )

      const validApplications = applicationsData.filter((app): app is Application => app !== null)
      setApplications(validApplications)
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
  }, [teacherId])

  return {
    applications,
    loading,
    error,
    refresh: loadApplications
  }
}