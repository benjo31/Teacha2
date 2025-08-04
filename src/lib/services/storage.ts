import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { app, db, auth } from '../firebase'

const storage = getStorage(app)

async function ensureAuthenticated() {
  if (!auth.currentUser) {
    throw new Error('USER_NOT_AUTHENTICATED')
  }
  return auth.currentUser
}

export async function uploadCV(userId: string, file: File): Promise<{ path: string; url: string }> {
  try {
    await ensureAuthenticated()
    
    // Définir le chemin du fichier
    const cvPath = `cv/${userId}/cv.pdf`
    const cvRef = ref(storage, cvPath)

    // Supprimer l'ancien CV s'il existe
    try {
      await deleteObject(cvRef)
    } catch (error: any) {
      // Ignorer l'erreur si le fichier n'existe pas
      if (error.code !== 'storage/object-not-found') {
        throw error
      }
    }

    // Upload du nouveau CV
    await uploadBytes(cvRef, file)
    const cvUrl = await getDownloadURL(cvRef)
    
    // Mettre à jour le document utilisateur dans Firestore
    await updateDoc(doc(db, 'teachers', userId), {
      cvPath,
      cvUrl
    })

    return {
      path: cvPath,
      url: cvUrl
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload du CV:', error)
    throw error
  }
}

export async function uploadPhoto(userId: string, file: File, croppedImage?: Blob): Promise<{ path: string; url: string }> {
  try {
    await ensureAuthenticated()
    
    // Définir le chemin du fichier
    const photoPath = `photos/${userId}/profile.jpg`
    const photoRef = ref(storage, photoPath)

    // Supprimer l'ancienne photo si elle existe
    try {
      await deleteObject(photoRef)
    } catch (error: any) {
      // Ignorer l'erreur si le fichier n'existe pas
      if (error.code !== 'storage/object-not-found') {
        throw error
      }
    }

    // Upload de la nouvelle photo
    await uploadBytes(photoRef, croppedImage || file)
    const photoUrl = await getDownloadURL(photoRef)
    
    // Mettre à jour le document utilisateur dans Firestore
    await updateDoc(doc(db, 'teachers', userId), {
      photoPath,
      photoUrl
    })

    return {
      path: photoPath,
      url: photoUrl
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error)
    throw error
  }
}

export async function uploadMessageAttachment(
  conversationId: string,
  messageId: string,
  file: File
): Promise<string> {
  try {
    await ensureAuthenticated()
    
    const attachmentPath = `conversations/${conversationId}/messages/${messageId}/${file.name}`
    const attachmentRef = ref(storage, attachmentPath)
    await uploadBytes(attachmentRef, file)
    return await getDownloadURL(attachmentRef)
  } catch (error) {
    console.error('Erreur lors de l\'upload de la pièce jointe:', error)
    throw error
  }
}

export async function getMessageAttachment(path: string): Promise<string> {
  try {
    await ensureAuthenticated()
    
    const attachmentRef = ref(storage, path)
    return await getDownloadURL(attachmentRef)
  } catch (error) {
    console.error('Erreur lors de la récupération de la pièce jointe:', error)
    throw error
  }
}