import { useEffect, useState } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { AvailableOffersList } from '../components/teachers/AvailableOffersList'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

type TeacherData = {
  firstName: string
  lastName: string
  email: string
  teachingLevels: string[]
  subjects: string[]
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTeacherData() {
      if (!user) return
      const docRef = doc(db, 'teachers', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setTeacherData(docSnap.data() as TeacherData)
      }
      setLoading(false)
    }

    loadTeacherData()
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!teacherData) {
    return <div>Une erreur est survenue</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Offres disponibles</h2>
        <AvailableOffersList />
      </div>
    </div>
  )
}