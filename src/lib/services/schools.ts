import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const schoolCache = new Map<string, { name: string; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getSchoolById(schoolId: string) {
  try {
    // Check cache first
    const cached = schoolCache.get(schoolId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { name: cached.name }
    }

    const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
    if (!schoolDoc.exists()) {
      throw new Error('School not found')
    }

    const schoolData = schoolDoc.data()
    
    // Update cache
    schoolCache.set(schoolId, {
      name: schoolData.name,
      timestamp: Date.now()
    })

    return schoolData
  } catch (error) {
    console.error('Error fetching school:', error)
    return { name: 'École' } // Fallback name
  }
}

export async function getAllSchools() {
  try {
    const schoolsRef = collection(db, 'schools')
    const snapshot = await getDocs(query(schoolsRef))
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching schools:', error)
    return []
  }
}