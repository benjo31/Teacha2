import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { z } from 'zod'
import { teacherSchema, schoolSchema } from '../schemas/auth'
import { uploadCV, uploadPhoto } from './storage'

type TeacherData = z.infer<typeof teacherSchema>
type SchoolData = z.infer<typeof schoolSchema>

export async function registerTeacher(data: TeacherData) {
  const { email, password, cv, photo, street, zipCode, city, ...teacherData } = data
  
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Se connecter explicitement pour garantir les permissions
    await signInWithEmailAndPassword(auth, email, password)
    
    try {
      // Créer d'abord le document Firestore sans les URLs
      await setDoc(doc(db, 'teachers', userCredential.user.uid), {
        ...teacherData,
        email,
        address: {
          street,
          zipCode,
          city
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      // Upload du CV si présent
      if (cv) {
        try {
          const uploadResult = await uploadCV(userCredential.user.uid, cv)
          await setDoc(doc(db, 'teachers', userCredential.user.uid), {
            cvPath: uploadResult.path,
            cvUrl: uploadResult.url
          }, { merge: true })
        } catch (error) {
          console.error('Erreur lors de l\'upload du CV:', error)
          // Ne pas propager l'erreur pour permettre la création du compte
        }
      }

      // Upload de la photo si présente
      if (photo) {
        try {
          const uploadResult = await uploadPhoto(userCredential.user.uid, photo)
          await setDoc(doc(db, 'teachers', userCredential.user.uid), {
            photoPath: uploadResult.path,
            photoUrl: uploadResult.url
          }, { merge: true })
        } catch (error) {
          console.error('Erreur lors de l\'upload de la photo:', error)
          // Ne pas propager l'erreur pour permettre la création du compte
        }
      }
      
      return userCredential.user
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error)
      throw error
    }
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('EMAIL_ALREADY_IN_USE')
    }
    console.error('Erreur lors de l\'inscription:', error)
    throw error
  }
}

export async function registerSchool(data: SchoolData) {
  const { email, password, ...schoolData } = data
  
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Stocker les données supplémentaires dans Firestore
    await setDoc(doc(db, 'schools', userCredential.user.uid), {
      ...schoolData,
      email,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    
    return userCredential.user
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('EMAIL_ALREADY_IN_USE')
    }
    console.error('Erreur lors de l\'inscription:', error)
    throw error
  }
}