import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Input } from '../ui/Input'
import { Lock, Mail } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const userCredential = await signIn(email, password)
      if (!userCredential?.user) {
        setError('Erreur de connexion')
        return
      }
      
      // Vérifier si c'est un admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid))
      if (adminDoc.exists()) {
        navigate('/admin')
        return
      }

      // Vérifier si c'est un enseignant
      const teacherDoc = await getDoc(doc(db, 'teachers', userCredential.user.uid))
      if (teacherDoc.exists()) {
        if (teacherDoc.data().status === 'pending') {
          navigate('/pending-approval')
        } else if (teacherDoc.data().status === 'approved') {
          navigate('/teacher-home')
        }
        return
      }

      // Vérifier si c'est une école
      const schoolDoc = await getDoc(doc(db, 'schools', userCredential.user.uid))
      if (schoolDoc.exists()) {
        if (schoolDoc.data().status === 'pending') {
          navigate('/pending-approval')
        } else if (schoolDoc.data().status === 'approved') {
          navigate('/school-home')
        }
        return
      }

      setError('Compte non trouvé')
    } catch (err) {
      console.error('Erreur de connexion:', err)
      setError('Identifiants invalides')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 text-lg"
              placeholder="Votre email"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 h-14 text-lg"
              placeholder="Votre mot de passe"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full h-14 text-lg"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}