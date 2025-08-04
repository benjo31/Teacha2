import { useState, useEffect } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Search, MapPin, BookOpen, Users, Eye } from 'lucide-react'
import { FavoriteSchoolButton } from '../components/teachers/FavoriteSchoolButton'
import { useFavoriteSchools } from '../hooks/useFavoriteSchools'
import { Link } from 'react-router-dom'
import { normalizeString } from '../lib/utils'
import { useTranslation } from '../lib/context/LanguageContext'

type School = {
  id: string
  name: string
  address: string
  canton: string
  teachingLevels: string[]
  classCount: number
  description?: string
  website?: string
}

export function SchoolsListPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [selectedCanton, setSelectedCanton] = useState<string>('')
  const { favoriteSchools, toggleFavorite } = useFavoriteSchools(user?.uid)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    async function loadSchools() {
      try {
        const schoolsQuery = query(collection(db, 'schools'))
        const snapshot = await getDocs(schoolsQuery)
        const schoolsData = snapshot.docs
          .filter(doc => doc.data().status === 'approved')
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as School[]
        setSchools(schoolsData)
      } catch (err) {
        console.error('Erreur lors du chargement des écoles:', err)
        setError(t('schoolsList.errorLoading'))
      } finally {
        setLoading(false)
      }
    }

    loadSchools()
  }, [])

  const filteredSchools = schools.filter(school => {
    const matchesSearch = searchTerm === '' || 
      normalizeString(school.name).includes(normalizeString(searchTerm))

    const matchesCity = citySearch === '' || 
      normalizeString(school.address).includes(normalizeString(citySearch))

    const matchesCanton = selectedCanton === '' || 
      school.canton === selectedCanton

    const matchesFavorites = !showFavoritesOnly || 
      favoriteSchools.includes(school.id)

    return matchesSearch && matchesCity && matchesCanton && matchesFavorites
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t('schoolsList.title')}</h1>
      </div>

      {/* Filtres */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche par nom */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('schoolsList.searchSchool')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Recherche par ville */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('schoolsList.searchCity')}
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Sélection du canton */}
          <select
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
            className="w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary py-2 px-4"
          >
            <option value="">{t('schoolsList.allCantons')}</option>
            {Array.from(new Set(schools.map(s => s.canton))).sort().map(canton => (
              <option key={canton} value={canton}>{canton}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>{t('schoolsList.showFavoritesOnly')}</span>
          </label>
        </div>
      </div>

      {/* Liste des écoles */}
      {filteredSchools.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('schoolsList.noSchoolsFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => (
            <div key={school.id} className="card p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{school.name}</h3>
                <FavoriteSchoolButton
                  teacherId={user?.uid || ''}
                  schoolId={school.id}
                  isFavorite={favoriteSchools.includes(school.id)}
                  onToggle={(isFavorite) => toggleFavorite(school.id, isFavorite)}
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {school.address}, {school.canton}
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {school.teachingLevels.join(', ')}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {school.classCount} {t('schoolsList.classes')}
                </div>
              </div>

              {school.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {school.description}
                </p>
              )}

              <div className="flex justify-end">
                <Link
                  to={`/schools/${school.id}`}
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('schoolsList.viewProfile')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}