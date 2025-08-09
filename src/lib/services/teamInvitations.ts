import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'
import { TeamInvitation } from '../schemas/teamInvitation'
import { v4 as uuidv4 } from 'uuid'

// Create a cross-reference invitation in global collection
export async function createTeamInvitation(
  schoolId: string,
  schoolName: string,
  email: string,
  role: 'school_admin' | 'school_teacher',
  invitedBy: string,
  invitedByName?: string,
  firstName?: string,
  lastName?: string,
  message?: string
): Promise<string> {
  try {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const invitationData: Partial<TeamInvitation> = {
      schoolId,
      schoolName,
      email,
      role,
      status: 'pending',
      invitedBy,
      invitedByName,
      firstName,
      lastName,
      message,
      token,
      expiresAt,
      createdAt: serverTimestamp()
    }

    // Create in global invitations collection for easy teacher lookup
    const docRef = await addDoc(collection(db, 'team_invitations'), invitationData)
    
    // Also create in school's teachers subcollection
    const batch = writeBatch(db)
    
    const schoolTeacherRef = doc(collection(db, `schools/${schoolId}/teachers`))
    batch.set(schoolTeacherRef, {
      ...invitationData,
      invitationId: docRef.id
    })
    
    await batch.commit()
    
    return docRef.id
  } catch (error) {
    console.error('Error creating team invitation:', error)
    throw error
  }
}

// Get all pending invitations for a teacher by email
export async function getTeacherInvitations(email: string): Promise<TeamInvitation[]> {
  try {
    const q = query(
      collection(db, 'team_invitations'),
      where('email', '==', email),
      where('status', '==', 'pending')
    )
    
    const snapshot = await getDocs(q)
    const invitations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TeamInvitation[]
    
    // Filter out expired invitations
    const now = new Date()
    return invitations.filter(inv => {
      if (inv.expiresAt && inv.expiresAt.toDate) {
        return inv.expiresAt.toDate() > now
      }
      return true
    })
  } catch (error) {
    console.error('Error getting teacher invitations:', error)
    return []
  }
}

// Accept an invitation
export async function acceptTeamInvitation(invitationId: string, userId: string): Promise<void> {
  try {
    const invitationRef = doc(db, 'team_invitations', invitationId)
    const invitationDoc = await getDoc(invitationRef)
    
    if (!invitationDoc.exists()) {
      throw new Error('INVITATION_NOT_FOUND')
    }
    
    const invitation = invitationDoc.data() as TeamInvitation
    
    // Check if expired
    if (invitation.expiresAt && invitation.expiresAt.toDate && invitation.expiresAt.toDate() < new Date()) {
      throw new Error('INVITATION_EXPIRED')
    }
    
    // Update global invitation
    await updateDoc(invitationRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      acceptedBy: userId,
      updatedAt: serverTimestamp()
    })
    
    // Update school's teacher subcollection
    const teachersQuery = query(
      collection(db, `schools/${invitation.schoolId}/teachers`),
      where('invitationId', '==', invitationId)
    )
    const teachersSnapshot = await getDocs(teachersQuery)
    
    if (!teachersSnapshot.empty) {
      const teacherDoc = teachersSnapshot.docs[0]
      await updateDoc(teacherDoc.ref, {
        status: 'active',
        teacherId: userId,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    
    // Add teacher role to user document
    const userRef = doc(db, 'teachers', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const schools = userData.schools || []
      
      if (!schools.find((s: any) => s.schoolId === invitation.schoolId)) {
        schools.push({
          schoolId: invitation.schoolId,
          schoolName: invitation.schoolName,
          role: invitation.role,
          joinedAt: serverTimestamp()
        })
        
        await updateDoc(userRef, {
          schools,
          role: invitation.role === 'school_admin' ? 'school_admin' : 'school_teacher'
        })
      }
    }
  } catch (error) {
    console.error('Error accepting invitation:', error)
    throw error
  }
}

// Reject an invitation
export async function rejectTeamInvitation(invitationId: string): Promise<void> {
  try {
    const invitationRef = doc(db, 'team_invitations', invitationId)
    
    await updateDoc(invitationRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    // Also update in school's subcollection
    const invitationDoc = await getDoc(invitationRef)
    if (invitationDoc.exists()) {
      const invitation = invitationDoc.data() as TeamInvitation
      
      const teachersQuery = query(
        collection(db, `schools/${invitation.schoolId}/teachers`),
        where('invitationId', '==', invitationId)
      )
      const teachersSnapshot = await getDocs(teachersQuery)
      
      if (!teachersSnapshot.empty) {
        const teacherDoc = teachersSnapshot.docs[0]
        await updateDoc(teacherDoc.ref, {
          status: 'rejected',
          rejectedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    }
  } catch (error) {
    console.error('Error rejecting invitation:', error)
    throw error
  }
}

// Get all team members for a school
export async function getSchoolTeamMembers(schoolId: string) {
  try {
    const snapshot = await getDocs(collection(db, `schools/${schoolId}/teachers`))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting school team members:', error)
    return []
  }
}

// Remove a team member
export async function removeTeamMember(schoolId: string, memberId: string): Promise<void> {
  try {
    // Delete from school's subcollection
    await deleteDoc(doc(db, `schools/${schoolId}/teachers`, memberId))
    
    // Also mark as removed in global invitations if exists
    const invitationsQuery = query(
      collection(db, 'team_invitations'),
      where('schoolId', '==', schoolId),
      where('email', '==', memberId)
    )
    const snapshot = await getDocs(invitationsQuery)
    
    if (!snapshot.empty) {
      const batch = writeBatch(db)
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'removed',
          removedAt: serverTimestamp()
        })
      })
      await batch.commit()
    }
  } catch (error) {
    console.error('Error removing team member:', error)
    throw error
  }
}

// Clean up expired invitations (can be called periodically)
export async function cleanupExpiredInvitations(): Promise<void> {
  try {
    const now = new Date()
    const expiredQuery = query(
      collection(db, 'team_invitations'),
      where('status', '==', 'pending')
    )
    
    const snapshot = await getDocs(expiredQuery)
    const batch = writeBatch(db)
    
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.expiresAt && data.expiresAt.toDate && data.expiresAt.toDate() < now) {
        batch.update(doc.ref, {
          status: 'expired',
          updatedAt: serverTimestamp()
        })
      }
    })
    
    await batch.commit()
  } catch (error) {
    console.error('Error cleaning up expired invitations:', error)
  }
}