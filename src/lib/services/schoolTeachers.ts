import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { z } from 'zod'
import { schoolTeacherSchema } from '../schemas/schoolTeacher'

type SchoolTeacherData = z.infer<typeof schoolTeacherSchema>

export async function inviteTeacher(schoolId: string, email: string) {
  try {
    // Vérifier si l'enseignant est déjà invité
    const existingQuery = query(
      collection(db, `schools/${schoolId}/teachers`),
      where('email', '==', email)
    )
    const existingDocs = await getDocs(existingQuery)
    
    if (!existingDocs.empty) {
      throw new Error('TEACHER_ALREADY_INVITED')
    }

    // Créer l'invitation
    const teacherData: SchoolTeacherData = {
      email,
      role: 'teacher',
      status: 'pending',
      createdAt: serverTimestamp()
    }

    await addDoc(collection(db, `schools/${schoolId}/teachers`), teacherData)

    // TODO: Envoyer un email d'invitation à l'enseignant
    
    return true
  } catch (error) {
    console.error('Error inviting teacher:', error)
    throw error
  }
}

export async function acceptInvitation(schoolId: string, teacherId: string) {
  try {
    const teacherRef = doc(db, `schools/${schoolId}/teachers`, teacherId)
    await updateDoc(teacherRef, {
      status: 'active',
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error accepting invitation:', error)
    throw error
  }
}

export async function getSchoolTeachers(schoolId: string) {
  try {
    const snapshot = await getDocs(collection(db, `schools/${schoolId}/teachers`))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting school teachers:', error)
    return []
  }
}