import { useState, useEffect } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { UpdateProfileForm } from '../components/teachers/UpdateProfileForm'
import { SchoolProfile } from '../components/schools/SchoolProfile'
import { TeamManagement } from '../components/schools/TeamManagement'
import { User, Shield, Trash2, Users } from 'lucide-react'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useTranslation } from '../lib/context/LanguageContext'

export function AccountPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null)

  useEffect(() => {
    async function loadUserData() {
      if (!user) return

      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
        const schoolDoc = await getDoc(doc(db, 'schools', user.uid))

        if (teacherDoc.exists()) {
          const data = teacherDoc.data()
          setUserData({ 
            ...data, 
            id: user.uid,
            type: 'teacher',
            street: data.address?.street,
            zipCode: data.address?.zipCode,
            city: data.address?.city
          })
          setUserType('teacher')
        } else if (schoolDoc.exists()) {
          setUserData({ ...schoolDoc.data(), type: 'school' })
          setUserType('school')
        }

        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setError(t('accountPage.errorLoading'))
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleRequestDeletion = () => {
    const subject = encodeURIComponent(t('accountPage.emailSubject'))
    const body = encodeURIComponent(
      t('accountPage.emailBody', { 
        name: `${userData.firstName} ${userData.lastName}`, 
        email: userData.email 
      })
    )
    window.location.href = `mailto:hello@teacha.ch?subject=${subject}&body=${body}`
    setShowDeleteConfirm(false)
  }

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

  if (!userData) {
    return <div>{t('accountPage.errorGeneral')}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">{t('accountPage.title')}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('accountPage.profile')}
          </TabsTrigger>
          {userType === 'school' && (
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('accountPage.team')}
            </TabsTrigger>
          )}
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('accountPage.security')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          {userType === 'teacher' ? (
            <UpdateProfileForm
              initialData={userData}
              onSuccess={() => {
                loadUserData()
              }}
            />
          ) : (
            <SchoolProfile />
          )}
        </TabsContent>

        {userType === 'school' && (
          <TabsContent value="team" className="mt-6">
            <TeamManagement />
          </TabsContent>
        )}

        <TabsContent value="security" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">{t('accountPage.security')}</h2>
            
            <div className="border-t pt-6">
              <h3 className="text-red-600 font-medium mb-2">{t('accountPage.dangerZone')}</h3>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {t('accountPage.deleteAccount')}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">{t('accountPage.confirmDeletion')}</h3>
            <p className="text-gray-600 mb-6">
              {t('accountPage.deletionMessage')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('accountPage.cancel')}
              </button>
              <button
                onClick={handleRequestDeletion}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                {t('accountPage.sendRequest')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}