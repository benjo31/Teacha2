import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, writeBatch, doc } from 'firebase/firestore'
import { z } from 'zod'
import { applicationSchema } from '../schemas/application'

type ApplicationData = z.infer<typeof applicationSchema>

export async function createApplication(data: ApplicationData) {
  // Vérifier si l'utilisateur a déjà postulé à cette offre
  const existingApplications = await getDocs(
    query(
      collection(db, 'applications'),
      where('teacherId', '==', data.teacherId),
      where('offerId', '==', data.offerId)
    )
  )

  if (!existingApplications.empty) {
    throw new Error('ALREADY_APPLIED')
  }

  // Créer la candidature avec les données correctement formatées
  return addDoc(collection(db, 'applications'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp()
  })
}

export async function inviteTeacherToOffer(
  offerId: string,
  schoolId: string,
  schoolName: string,
  teacherEmail: string,
  message?: string
) {
  try {
    // Check if teacher is already invited to this offer
    const existingInvitations = await getDocs(
      query(
        collection(db, 'applications'),
        where('teacherEmail', '==', teacherEmail),
        where('offerId', '==', offerId),
        where('status', '==', 'invited')
      )
    )

    if (!existingInvitations.empty) {
      throw new Error('ALREADY_INVITED')
    }

    // Create invitation as an application with 'invited' status
    const invitationData = {
      offerId,
      schoolId,
      schoolName,
      teacherEmail,
      status: 'invited',
      message: message || '',
      createdAt: serverTimestamp()
    }

    return addDoc(collection(db, 'applications'), invitationData)
  } catch (error) {
    console.error('Error inviting teacher:', error)
    throw error
  }
}

export async function getTeacherInvitations(teacherEmail: string) {
  try {
    const invitationsQuery = query(
      collection(db, 'applications'),
      where('teacherEmail', '==', teacherEmail),
      where('status', '==', 'invited')
    )
    
    const snapshot = await getDocs(invitationsQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting teacher invitations:', error)
    return []
  }
}

export async function acceptInvitation(invitationId: string, teacherId: string) {
  try {
    const invitationRef = doc(db, 'applications', invitationId)
    await writeBatch(db)
      .update(invitationRef, {
        status: 'pending',
        teacherId,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      .commit()
    return true
  } catch (error) {
    console.error('Error accepting invitation:', error)
    throw error
  }
}

export async function rejectInvitation(invitationId: string) {
  try {
    const invitationRef = doc(db, 'applications', invitationId)
    await writeBatch(db)
      .update(invitationRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      .commit()
    return true
  } catch (error) {
    console.error('Error rejecting invitation:', error)
    throw error
  }
}

export async function rejectOtherApplications(acceptedApplicationId: string, offerId: string) {
  const batch = writeBatch(db)
  
  // Récupérer toutes les autres candidatures pour cette offre
  const otherApplicationsQuery = query(
    collection(db, 'applications'),
    where('offerId', '==', offerId),
    where('status', '==', 'pending')
  )
  
  const otherApplications = await getDocs(otherApplicationsQuery)
  
  otherApplications.docs.forEach(doc => {
    if (doc.id !== acceptedApplicationId) {
      batch.update(doc.ref, { 
        status: 'rejected',
        updatedAt: serverTimestamp()
      })
    }
  })
  
  await batch.commit()
}