import { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs'
import { UserList } from './UserList'
import { School, GraduationCap } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useTranslation } from '../../lib/context/LanguageContext'

export function UserManagement() {
  const { t } = useTranslation()
  const [teachers, setTeachers] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teachers')

  useEffect(() => {
    async function loadUsers() {
      try {
        // Load teachers
        const teachersQuery = query(collection(db, 'teachers'))
        const teachersSnapshot = await getDocs(teachersQuery)
        const teachersData = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTeachers(teachersData)

        // Load schools
        const schoolsQuery = query(collection(db, 'schools'))
        const schoolsSnapshot = await getDocs(schoolsQuery)
        const schoolsData = schoolsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSchools(schoolsData)

        setLoading(false)
      } catch (error) {
        console.error('Error loading users:', error)
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('admin.userManagement.title')}</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('admin.userManagement.teachers')} ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            {t('admin.userManagement.schools')} ({schools.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <UserList 
            users={teachers}
            type="teacher"
            columns={[
              { key: 'firstName', label: t('admin.userManagement.columns.firstName') },
              { key: 'lastName', label: t('admin.userManagement.columns.lastName') },
              { key: 'email', label: t('admin.userManagement.columns.email') },
              { key: 'status', label: t('admin.userManagement.columns.status') },
              { key: 'canton', label: t('admin.userManagement.columns.canton') }
            ]}
          />
        </TabsContent>

        <TabsContent value="schools">
          <UserList 
            users={schools}
            type="school"
            columns={[
              { key: 'name', label: t('admin.userManagement.columns.name') },
              { key: 'email', label: t('admin.userManagement.columns.email') },
              { key: 'status', label: t('admin.userManagement.columns.status') },
              { key: 'canton', label: t('admin.userManagement.columns.canton') },
              { key: 'classCount', label: t('admin.userManagement.columns.classes') }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}