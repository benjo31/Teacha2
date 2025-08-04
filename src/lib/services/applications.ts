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