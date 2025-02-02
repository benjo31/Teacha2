import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCx3epVPmzkKVG-uCk_vluKeOGcdYL99_o",
  authDomain: "swiss-teacher-replacement.firebaseapp.com",
  projectId: "swiss-teacher-replacement",
  storageBucket: "swiss-teacher-replacement.firebasestorage.app",
  messagingSenderId: "994626704267",
  appId: "1:994626704267:web:0f3de9138c5c1e025e158e",
  measurementId: "G-QX0MEH1MZ2"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)