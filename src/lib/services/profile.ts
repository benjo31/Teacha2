import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { uploadCV, uploadPhoto } from './storage'
import { z } from 'zod'
import { teacherProfileSchema } from '../schemas/profile'

type TeacherProfileData = z.infer<typeof teacherProfileSchema>

export async function updateTeacherProfile(data: TeacherProfileData, newPhoto?: File, newCV?: File) {
  try {
    const { id, street, zipCode, city, ...updates } = data

    // Préparer les données à mettre à jour
    const formattedUpdates = {
      ...updates,
      address: {
        street,
        zipCode,
        city
      }
    }

    // Supprimer les champs qui ne doivent pas être dans la racine du document
    delete formattedUpdates.photoPath
    delete formattedUpdates.photoUrl
    delete formattedUpdates.cvPath
    delete formattedUpdates.cvUrl
    
    // Upload de la nouvelle photo si fournie
    if (newPhoto) {
      const photoResult = await uploadPhoto(id, newPhoto)
      formattedUpdates.photoUrl = photoResult.url
      formattedUpdates.photoPath = photoResult.path
    }

    // Upload du nouveau CV si fourni
    if (newCV) {
      const cvResult = await uploadCV(id, newCV)
      formattedUpdates.cvUrl = cvResult.url
      formattedUpdates.cvPath = cvResult.path
    }

    // Mise à jour du profil dans Firestore
    const teacherRef = doc(db, 'teachers', id)
    await updateDoc(teacherRef, formattedUpdates)

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    throw new Error('Erreur lors de la mise à jour du profil')
  }
}