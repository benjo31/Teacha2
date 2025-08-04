import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useTranslation } from '../../lib/context/LanguageContext'
import { Search, Briefcase, Clock, CheckCircle } from 'lucide-react'

type Offer = {
  id: string
  title: string
  schoolName: string
  startDate: string
  endDate: string
  status: 'active' | 'filled' | 'expired'
  urgent: boolean
  subjects: string[]
  teachingLevels: string[]
  applicationCount: number
}

export function GlobalOffersView() {
  const { t } = useTranslation()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'urgent' | 'filled'>('all')

  useEffect(() => {
    const q = query(
      collection(db, 'offers'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const offersData: Offer[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        offersData.push({
          id: doc.id,
          title: data.title || '',
          schoolName: data.schoolName || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          status: data.status || 'active',
          urgent: data.urgent || false,
          subjects: data.subjects || [],
          teachingLevels: data.teachingLevels || [],
          applicationCount: data.applicationCount || 0
        })
      })
      setOffers(offersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === 'all') return matchesSearch
    if (statusFilter === 'urgent') return matchesSearch && offer.urgent
    return matchesSearch && offer.status === statusFilter
  })

  const stats = {
    total: offers.length,
    active: offers.filter(o => o.status === 'active').length,
    urgent: offers.filter(o => o.urgent && o.status === 'active').length,
    filled: offers.filter(o => o.status === 'filled').length,
    applications: offers.reduce((sum, o) => sum + o.applicationCount, 0)
  }

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">{t('admin.offers.stats.total')}</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">{t('admin.offers.stats.active')}</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
          <div className="text-sm text-gray-600">{t('admin.offers.stats.urgent')}</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.filled}</div>
          <div className="text-sm text-gray-600">{t('admin.offers.stats.filled')}</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.applications}</div>
          <div className="text-sm text-gray-600">{t('admin.offers.stats.applications')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('admin.offers.filter.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border rounded-md"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 border rounded-md"
          >
            <option value="all">{t('admin.offers.filter.status')}</option>
            <option value="active">{t('admin.offers.stats.active')}</option>
            <option value="urgent">{t('admin.offers.filter.urgentOnly')}</option>
            <option value="filled">{t('admin.offers.stats.filled')}</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{offer.title}</h3>
                  {offer.urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {t('status.urgent')}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    offer.status === 'active' ? 'bg-green-100 text-green-800' :
                    offer.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`status.${offer.status}`)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{offer.schoolName}</p>
                
                <div className="text-sm text-gray-500">
                  {offer.startDate} - {offer.endDate}
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {offer.applicationCount} {t('admin.offers.stats.applications')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredOffers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('admin.offers.noOffersFound')}
          </div>
        )}
      </div>
    </div>
  )
}