import { useState, useEffect } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { useTranslation } from '../lib/context/LanguageContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { CreateOfferForm } from '../components/schools/CreateOfferForm'
import { OffersList } from '../components/schools/OffersList'
import { TeachersList } from '../components/schools/TeachersList'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { FileText, Users } from 'lucide-react'

type SchoolData = {
  name: string
  address: string
  canton: string
  teachingLevels: string[]
  classCount: number
}

export function SchoolDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('offers')

  useEffect(() => {
    async function loadSchoolData() {
      if (!user) return
      const docRef = doc(db, 'schools', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSchoolData(docSnap.data() as SchoolData)
      }
      setLoading(false)
    }

    loadSchoolData()
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!schoolData) {
    return <div>{t('common.error')}</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('school.dashboard.title')}</h1>
          <TabsList>
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('navigation.school.offers')}
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('school.team.title')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="offers">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
            >
              {showCreateForm ? t('common.close') : t('school.offers.create')}
            </button>
          </div>

          {showCreateForm && (
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">{t('school.createOffer.title')}</h2>
              <CreateOfferForm />
            </div>
          )}

          <OffersList />
        </TabsContent>

        <TabsContent value="teachers">
          <TeachersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}