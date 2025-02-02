import { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs'
import { UserList } from './UserList'
import { School, GraduationCap } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function UserManagement() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teachers')

  useEffect(() => {
    async function loadUsers() {
      try {
        // Charger les remplaçants
        const teachersQuery = query(collection(db, 'teachers'))
        const teachersSnapshot = await getDocs(teachersQuery)
        const teachersData = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTeachers(teachersData)

        // Charger les écoles
        const schoolsQuery = query(collection(db, 'schools'))
        const schoolsSnapshot = await getDocs(schoolsQuery)
        const schoolsData = schoolsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSchools(schoolsData)

        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error)
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
      <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Remplaçants ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Écoles ({schools.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <UserList 
            users={teachers}
            type="teacher"
            columns={[
              { key: 'firstName', label: 'Prénom' },
              { key: 'lastName', label: 'Nom' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Statut' },
              { key: 'canton', label: 'Canton' }
            ]}
          />
        </TabsContent>

        <TabsContent value="schools">
          <UserList 
            users={schools}
            type="school"
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Statut' },
              { key: 'canton', label: 'Canton' },
              { key: 'classCount', label: 'Classes' }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}