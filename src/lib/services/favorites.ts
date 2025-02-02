import { collection, query, where, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function addSchoolToFavorites(teacherId: string, schoolId: string) {
  try {
    await addDoc(collection(db, 'favorite_schools'), {
      teacherId,
      schoolId,
      createdAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error adding school to favorites:', error)
    return false
  }
}

export async function removeSchoolFromFavorites(teacherId: string, schoolId: string) {
  try {
    const q = query(
      collection(db, 'favorite_schools'),
      where('teacherId', '==', teacherId),
      where('schoolId', '==', schoolId)
    )
    const snapshot = await getDocs(q)
    const doc = snapshot.docs[0]
    if (doc) {
      await deleteDoc(doc.ref)
    }
    return true
  } catch (error) {
    console.error('Error removing school from favorites:', error)
    return false
  }
}

export async function getFavoriteSchools(teacherId: string): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'favorite_schools'),
      where('teacherId', '==', teacherId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().schoolId)
  } catch (error) {
    console.error('Error getting favorite schools:', error)
    return []
  }
}