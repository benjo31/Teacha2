import { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Users, School, FileText, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from '../../lib/context/LanguageContext'

export function Analytics() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchools: 0,
    totalOffers: 0,
    totalApplications: 0,
    pendingTeachers: 0,
    pendingSchools: 0,
    approvedTeachers: 0,
    approvedSchools: 0,
    activeOffers: 0,
    filledOffers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // Statistiques des remplaçants
        const teachersQuery = query(collection(db, 'teachers'))
        const teachersSnapshot = await getDocs(teachersQuery)
        const totalTeachers = teachersSnapshot.size
        const pendingTeachers = teachersSnapshot.docs.filter(doc => doc.data().status === 'pending').length
        const approvedTeachers = teachersSnapshot.docs.filter(doc => doc.data().status === 'approved').length

        // Statistiques des écoles
        const schoolsQuery = query(collection(db, 'schools'))
        const schoolsSnapshot = await getDocs(schoolsQuery)
        const totalSchools = schoolsSnapshot.size
        const pendingSchools = schoolsSnapshot.docs.filter(doc => doc.data().status === 'pending').length
        const approvedSchools = schoolsSnapshot.docs.filter(doc => doc.data().status === 'approved').length

        // Statistiques des offres
        const offersQuery = query(collection(db, 'replacement-offers'))
        const offersSnapshot = await getDocs(offersQuery)
        const totalOffers = offersSnapshot.size
        const activeOffers = offersSnapshot.docs.filter(doc => doc.data().status === 'active').length
        const filledOffers = offersSnapshot.docs.filter(doc => doc.data().status === 'filled').length

        // Statistiques des candidatures
        const applicationsQuery = query(collection(db, 'applications'))
        const applicationsSnapshot = await getDocs(applicationsQuery)
        const totalApplications = applicationsSnapshot.size

        setStats({
          totalTeachers,
          totalSchools,
          totalOffers,
          totalApplications,
          pendingTeachers,
          pendingSchools,
          approvedTeachers,
          approvedSchools,
          activeOffers,
          filledOffers
        })

        setLoading(false)
      } catch (error) {
        console.error(t('analytics.errorLoading'), error)
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const chartData = [
    { name: t('analytics.charts.teachers'), total: stats.totalTeachers, approved: stats.approvedTeachers },
    { name: t('analytics.charts.schools'), total: stats.totalSchools, approved: stats.approvedSchools },
    { name: t('analytics.charts.offers'), total: stats.totalOffers, filled: stats.filledOffers }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('analytics.stats.totalTeachers')}</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalTeachers}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.approvedTeachers} {t('analytics.stats.approvedTeachers')} · {stats.pendingTeachers} {t('analytics.stats.pendingTeachers')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('analytics.stats.totalSchools')}</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalSchools}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <School className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.approvedSchools} {t('analytics.stats.approvedSchools')} · {stats.pendingSchools} {t('analytics.stats.pendingSchools')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('analytics.stats.activeOffers')}</p>
              <p className="text-2xl font-semibold mt-1">{stats.activeOffers}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {stats.filledOffers} {t('analytics.stats.filledOffers')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('analytics.stats.applications')}</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalApplications}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {(stats.totalApplications / stats.totalOffers).toFixed(1)} {t('analytics.stats.applicationsPerOffer')}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">{t('analytics.overview')}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" name={t('analytics.charts.total')} />
              <Bar dataKey="approved" fill="#22c55e" name={t('analytics.charts.approved')} />
              <Bar dataKey="filled" fill="#22c55e" name={t('analytics.charts.filled')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}