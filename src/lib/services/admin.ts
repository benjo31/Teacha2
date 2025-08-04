import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

export async function createAdminUser(email: string, password: string) {
  try {
    // Vérifier si l'email existe déjà dans la collection admins
    const adminsSnapshot = await getDoc(doc(db, 'admins', email))
    if (adminsSnapshot.exists()) {
      throw new Error('ADMIN_ALREADY_EXISTS')
    }

    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Créer le document admin dans Firestore
    await setDoc(doc(db, 'admins', userCredential.user.uid), {
      email,
      role: 'admin',
      createdAt: serverTimestamp()
    })
    
    return userCredential.user
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('EMAIL_ALREADY_USED')
    }
    throw error
  }
}