import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { School, MapPin, Globe, Phone, Mail, Clock, BookOpen, Users, Building, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FavoriteSchoolButton } from '../teachers/FavoriteSchoolButton'
import { useFavoriteSchools } from '../../hooks/useFavoriteSchools'
import { SchoolOffers } from './SchoolOffers'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs'

interface SchoolProfileProps {
  schoolData?: any
  showBackButton?: boolean
}

export function SchoolProfile({ schoolData: initialData, showBackButton = false }: SchoolProfileProps) {
  const { user } = useAuth()
  const [schoolData, setSchoolData] = useState<any>(initialData)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState('')
  const { favoriteSchools, toggleFavorite } = useFavoriteSchools(user?.uid)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    async function loadSchoolData() {
      if (initialData || !user) return

      try {
        const schoolDoc = await getDoc(doc(db, 'schools', user.uid))
        if (schoolDoc.exists()) {
          setSchoolData(schoolDoc.data())
        }
        setLoading(false)
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
        setError('Une erreur est survenue lors du chargement des données')
        setLoading(false)
      }
    }

    loadSchoolData()
  }, [user, initialData])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (!schoolData) {
    return <div>Aucune donnée disponible</div>
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons */}
      <div className="flex items-center justify-between mb-6">
        {showBackButton && (
          <Link
            to="/schools"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour à la liste
          </Link>
        )}
        
        {user && schoolData.id && (
          <FavoriteSchoolButton
            teacherId={user.uid}
            schoolId={schoolData.id}
            isFavorite={favoriteSchools.includes(schoolData.id)}
            onToggle={(isFavorite) => toggleFavorite(schoolData.id, isFavorite)}
          />
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="offers">Offres en cours</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* Informations principales */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <School className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{schoolData.name}</h1>
                <p className="text-gray-600">{schoolData.canton}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{schoolData.address}</span>
                </div>
                {schoolData.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-3" />
                    <a 
                      href={schoolData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      {schoolData.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <span>{schoolData.classCount} classes</span>
                </div>
              </div>

              {schoolData.contactPerson && (
                <div className="space-y-4">
                  <h3 className="font-medium">Contact principal</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">{schoolData.contactPerson.name}</p>
                    <p className="text-gray-600">{schoolData.contactPerson.role}</p>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{schoolData.contactPerson.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{schoolData.contactPerson.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Niveaux d'enseignement */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Niveaux d'enseignement
            </h2>
            <div className="flex flex-wrap gap-2">
              {schoolData.teachingLevels?.map((level: string) => (
                <span
                  key={level}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>

          {/* Classes spéciales */}
          {schoolData.specialClasses && schoolData.specialClasses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Classes spéciales
              </h2>
              <div className="flex flex-wrap gap-2">
                {schoolData.specialClasses.map((specialClass: string) => (
                  <span
                    key={specialClass}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {specialClass}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Horaires */}
          {schoolData.schedule && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horaires typiques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Matin</h3>
                  <p className="text-gray-600">
                    {schoolData.schedule.morningStart} - {schoolData.schedule.morningEnd}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Après-midi</h3>
                  <p className="text-gray-600">
                    {schoolData.schedule.afternoonStart} - {schoolData.schedule.afternoonEnd}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description et projets */}
          {(schoolData.description || schoolData.pedagogicalProjects) && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              {schoolData.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    À propos de l'établissement
                  </h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{schoolData.description}</p>
                </div>
              )}
              
              {schoolData.pedagogicalProjects && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Projets pédagogiques</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{schoolData.pedagogicalProjects}</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-6">Offres de remplacement en cours</h2>
            <SchoolOffers schoolId={schoolData.id} schoolName={schoolData.name} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}