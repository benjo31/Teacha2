import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

interface SchoolStatsProps {
  schoolId: string
}

export function SchoolStats({ schoolId }: SchoolStatsProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    activeOffers: 0,
    receivedApplications: 0,
    filledPositions: 0,
    expiringOffers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // Query for active offers
        const activeOffersQuery = query(
          collection(db, 'replacement-offers'),
          where('schoolId', '==', schoolId),
          where('status', '==', 'active')
        )
        const activeOffersSnapshot = await getDocs(activeOffersQuery)
        const activeOffersCount = activeOffersSnapshot.size

        // Query for received applications
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('schoolId', '==', schoolId)
        )
        const applicationsSnapshot = await getDocs(applicationsQuery)
        const applicationsCount = applicationsSnapshot.size

        // Query for filled positions
        const filledOffersQuery = query(
          collection(db, 'replacement-offers'),
          where('schoolId', '==', schoolId),
          where('status', '==', 'filled')
        )
        const filledOffersSnapshot = await getDocs(filledOffersQuery)
        const filledOffersCount = filledOffersSnapshot.size

        // Calculate offers expiring soon (within 7 days)
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        let expiringCount = 0

        for (const doc of activeOffersSnapshot.docs) {
          const offerDate = new Date(doc.data().date)
          if (offerDate <= nextWeek && offerDate >= now) {
            expiringCount++
          }
        }

        setStats({
          activeOffers: activeOffersCount,
          receivedApplications: applicationsCount,
          filledPositions: filledOffersCount,
          expiringOffers: expiringCount
        })

        setLoading(false)
      } catch (error) {
        console.error('Error loading statistics:', error)
        setLoading(false)
      }
    }

    loadStats()
  }, [schoolId])

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
            <p className="text-sm font-medium text-gray-500">{t('schoolStats.activeOffers')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.activeOffers}</p>
          </div>
          <span className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('schoolStats.receivedApplications')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.receivedApplications}</p>
          </div>
          <span className="p-2 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('schoolStats.filledPositions')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.filledPositions}</p>
          </div>
          <span className="p-2 bg-orange-50 rounded-lg">
            <Clock className="h-5 w-5 text-warning" />
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('schoolStats.expiringOffers')}</p>
            <p className="text-2xl font-semibold mt-1">{stats.expiringOffers}</p>
          </div>
          <span className="p-2 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </span>
        </div>
      </div>
    </div>
  )
}