import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { SchoolProfile } from '../components/schools/SchoolProfile'

export function SchoolProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [schoolData, setSchoolData] = useState<any>(null)

  useEffect(() => {
    async function loadSchoolData() {
      if (!id) return

      try {
        const schoolDoc = await getDoc(doc(db, 'schools', id))
        if (schoolDoc.exists()) {
          setSchoolData({ id, ...schoolDoc.data() })
        } else {
          setError('École non trouvée')
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
        setError('Une erreur est survenue lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    loadSchoolData()
  }, [id])

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

  if (!schoolData) {
    return <div>École non trouvée</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SchoolProfile schoolData={schoolData} showBackButton />
    </div>
  )
}