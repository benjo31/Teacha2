import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Check, X } from 'lucide-react'

type School = {
  id: string
  name: string
  email: string
  address: string
  canton: string
  teachingLevels: string[]
  classCount: number
  status: string
  createdAt: string
}

export function PendingSchoolsList() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPendingSchools()
  }, [])

  async function loadPendingSchools() {
    const q = query(
      collection(db, 'schools'),
      where('status', '==', 'pending')
    )
    
    const snapshot = await getDocs(q)
    const schoolsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as School[]
    
    setSchools(schoolsData)
    setLoading(false)
  }

  async function handleApprove(schoolId: string) {
    await updateDoc(doc(db, 'schools', schoolId), {
      status: 'approved'
    })
    await loadPendingSchools()
  }

  async function handleReject(schoolId: string) {
    await updateDoc(doc(db, 'schools', schoolId), {
      status: 'rejected'
    })
    await loadPendingSchools()
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (schools.length === 0) {
    return <div>Aucune école en attente de validation</div>
  }

  return (
    <div className="space-y-4">
      {schools.map((school) => (
        <div
          key={school.id}
          className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-start"
        >
          <div>
            <h3 className="font-medium">{school.name}</h3>
            <p className="text-sm text-gray-500">{school.email}</p>
            <div className="mt-2 text-sm">
              <p>Adresse: {school.address}</p>
              <p>Canton: {school.canton}</p>
              <p>Niveaux: {school.teachingLevels.join(', ')}</p>
              <p>Nombre de classes: {school.classCount}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(school.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleReject(school.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}