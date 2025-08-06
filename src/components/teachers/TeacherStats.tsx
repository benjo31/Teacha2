import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Calendar, Clock, CheckCircle, Award } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

interface TeacherStatsProps {
  teacherId: string
}

export function TeacherStats({ teacherId }: TeacherStatsProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    currentApplications: 0,
    acceptedThisMonth: 0,
    completedLessons: 0,
    upcomingLessons: 0,
    totalReplacements: 0,
    topSubjects: [] as { subject: string; count: number }[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // Query for current applications
        const currentApplicationsQuery = query(
          collection(db, 'applications'),
          where('teacherId', '==', teacherId),
          where('status', '==', 'pending')
        )
        const currentApplicationsSnapshot = await getDocs(currentApplicationsQuery)
        const currentApplicationsCount = currentApplicationsSnapshot.size

        // Query for applications accepted this month
        const acceptedThisMonthQuery = query(
          collection(db, 'applications'),
          where('teacherId', '==', teacherId),
          where('status', '==', 'accepted'),
          where('createdAt', '>=', startOfMonth),
          where('createdAt', '<=', endOfMonth)
        )
        const acceptedThisMonthSnapshot = await getDocs(acceptedThisMonthQuery)
        const acceptedThisMonthCount = acceptedThisMonthSnapshot.size

        // Calculate completed and upcoming lessons
        let completedLessons = 0
        let upcomingLessons = 0
        let subjects = new Map<string, number>()

        const acceptedApplicationsQuery = query(
          collection(db, 'applications'),
          where('teacherId', '==', teacherId),
          where('status', '==', 'accepted')
        )
        const acceptedApplicationsSnapshot = await getDocs(acceptedApplicationsQuery)

        for (const doc of acceptedApplicationsSnapshot.docs) {
          const application = doc.data()
          const offerDoc = await getDocs(
            query(collection(db, 'replacement-offers'), 
            where('__name__', '==', application.offerId))
          )
          
          if (!offerDoc.empty) {
            const offer = offerDoc.docs[0].data()
            const offerDate = new Date(offer.startDate)

            if (offerDate < now) {
              completedLessons += offer.totalLessons
            } else {
              upcomingLessons += offer.totalLessons
            }

            subjects.set(offer.subject, (subjects.get(offer.subject) || 0) + 1)
          }
        }

        // Sort subjects by number of occurrences
        const topSubjects = Array.from(subjects.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([subject, count]) => ({ subject, count }))

        setStats({
          currentApplications: currentApplicationsCount,
          acceptedThisMonth: acceptedThisMonthCount,
          completedLessons,
          upcomingLessons,
          totalReplacements: acceptedApplicationsSnapshot.size,
          topSubjects
        })

        setLoading(false)
      } catch (error) {
        console.error('Error loading statistics:', error)
        setLoading(false)
      }
    }

    loadStats()
  }, [teacherId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('teacherStats.currentApplications')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.currentApplications}</p>
          </div>
          <span className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('teacherStats.acceptedThisMonth')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.acceptedThisMonth}</p>
          </div>
          <span className="p-2 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('teacherStats.completedLessons')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.completedLessons}</p>
          </div>
          <span className="p-2 bg-orange-50 rounded-lg">
            <Clock className="h-5 w-5 text-warning" />
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.upcomingLessons} {t('teacherStats.upcomingLessons')}
        </p>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('teacherStats.totalReplacements')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.totalReplacements}</p>
          </div>
          <span className="p-2 bg-purple-50 rounded-lg">
            <Award className="h-5 w-5 text-purple-500" />
          </span>
        </div>
        {stats.topSubjects.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">{t('teacherStats.topSubjects')}:</p>
            <div className="space-y-1 mt-1">
              {stats.topSubjects.map((subject, index) => (
                <p key={index} className="text-sm">
                  {subject.subject} ({subject.count})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}