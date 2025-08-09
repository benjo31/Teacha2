import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useTranslation } from '../lib/context/LanguageContext'

export function AdminLoginPage() {
  const { t } = useTranslation()
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
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid))
      
      if (adminDoc.exists()) {
        navigate('/admin')
      } else {
        setError(t('adminLogin.unauthorizedAccess'))
        await signIn(email, password) // Sign out
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(t('adminLogin.invalidCredentials'))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">{t('adminLogin.title')}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('adminLogin.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('adminLogin.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {t('adminLogin.signIn')}
        </button>
      </form>
    </div>
  )
}