import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { z } from 'zod'
import { replacementOfferSchema } from '../schemas/offer'
import { getSchoolById } from './schools'

type OfferData = z.infer<typeof replacementOfferSchema>

export async function createOffer(data: OfferData) {
  try {
    replacementOfferSchema.parse(data)
    
    // Calculer si l'offre est urgente (moins de 48h avant le début)
    const startDate = new Date(data.startDate)
    const now = new Date()
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    const isUrgent = hoursUntilStart <= 48 && hoursUntilStart > 0

    const offerRef = await addDoc(collection(db, 'replacement-offers'), {
      ...data,
      status: 'active',
      isUrgent,
      createdAt: serverTimestamp()
    })

    return offerRef.id
  } catch (error) {
    console.error('Error creating offer:', error)
    throw error
  }
}

export async function getActiveOffers() {
  try {
    // Récupérer toutes les offres actives
    const offersQuery = query(
      collection(db, 'replacement-offers'),
      where('status', '==', 'active')
    )
    const snapshot = await getDocs(offersQuery)
    
    // Traiter les offres et récupérer les noms des écoles
    const offersWithSchools = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data()
        const school = await getSchoolById(data.schoolId)
        
        // Calculer si l'offre est urgente
        const startDate = new Date(data.startDate)
        const now = new Date()
        const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        const isUrgent = hoursUntilStart <= 48 && hoursUntilStart > 0

        return {
          id: doc.id,
          ...data,
          schoolName: school.name,
          startDate: data.startDate,
          endDate: data.endDate,
          isUrgent,
          createdAt: data.createdAt?.toDate() || new Date()
        }
      })
    )

    return offersWithSchools
  } catch (error) {
    console.error('Error fetching offers:', error)
    throw error
  }
}

export async function updateOfferStatus(offerId: string, status: 'active' | 'filled') {
  try {
    const offerRef = doc(db, 'replacement-offers', offerId)
    await updateDoc(offerRef, {
      status,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating offer status:', error)
    throw error
  }
}