import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, increment, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { z } from 'zod'
import { schoolTeacherSchema, type SchoolTeacher } from '../schemas/schoolTeacher'
import { type Role } from '../schemas/permissions'

type SchoolTeacherData = z.infer<typeof schoolTeacherSchema>

export async function inviteTeacher(
  schoolId: string, 
  email: string, 
  invitedBy: string,
  role: Role = 'teacher',
  firstName?: string,
  lastName?: string
) {
  try {
    // Check invitation limits
    const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
    if (!schoolDoc.exists()) {
      throw new Error('SCHOOL_NOT_FOUND')
    }
    
    const schoolData = schoolDoc.data()
    const maxInvitations = schoolData.plan?.maxInvitations ?? 20
    const usedInvitations = schoolData.plan?.usedInvitations ?? 0
    
    if (usedInvitations >= maxInvitations) {
      throw new Error('INVITATION_LIMIT_REACHED')
    }

    // Check if teacher is already invited
    const existingQuery = query(
      collection(db, `schools/${schoolId}/teachers`),
      where('email', '==', email)
    )
    const existingDocs = await getDocs(existingQuery)
    
    if (!existingDocs.empty) {
      throw new Error('TEACHER_ALREADY_INVITED')
    }

    // Create invitation
    const teacherData: Partial<SchoolTeacherData> = {
      email,
      role,
      status: 'pending',
      invitedBy,
      firstName,
      lastName,
      createdAt: serverTimestamp()
    }

    await addDoc(collection(db, `schools/${schoolId}/teachers`), teacherData)

    // Update used invitations count
    await updateDoc(doc(db, 'schools', schoolId), {
      'plan.usedInvitations': increment(1)
    })

    // TODO: Send invitation email
    
    return true
  } catch (error) {
    console.error('Error inviting teacher:', error)
    throw error
  }
}

export async function acceptInvitation(schoolId: string, teacherId: string, actualTeacherId: string) {
  try {
    const teacherRef = doc(db, `schools/${schoolId}/teachers`, teacherId)
    await updateDoc(teacherRef, {
      status: 'active',
      teacherId: actualTeacherId,
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error accepting invitation:', error)
    throw error
  }
}

export async function rejectInvitation(schoolId: string, teacherId: string) {
  try {
    const teacherRef = doc(db, `schools/${schoolId}/teachers`, teacherId)
    await updateDoc(teacherRef, {
      status: 'rejected',
      updatedAt: serverTimestamp()
    })
    
    // Decrease used invitations count
    await updateDoc(doc(db, 'schools', schoolId), {
      'plan.usedInvitations': increment(-1)
    })
    
    return true
  } catch (error) {
    console.error('Error rejecting invitation:', error)
    throw error
  }
}

export async function removeTeacher(schoolId: string, teacherId: string) {
  try {
    const teacherRef = doc(db, `schools/${schoolId}/teachers`, teacherId)
    await deleteDoc(teacherRef)
    
    // Decrease used invitations count
    await updateDoc(doc(db, 'schools', schoolId), {
      'plan.usedInvitations': increment(-1)
    })
    
    return true
  } catch (error) {
    console.error('Error removing teacher:', error)
    throw error
  }
}

export async function updateTeacherRole(schoolId: string, teacherId: string, newRole: Role) {
  try {
    const teacherRef = doc(db, `schools/${schoolId}/teachers`, teacherId)
    await updateDoc(teacherRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating teacher role:', error)
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