import { useState } from 'react'
import { createAdminUser } from '../lib/services/admin'
import { useTranslation } from '../lib/context/LanguageContext'

export function CreateAdminPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    try {
      await createAdminUser(email, password)
      setSuccess(true)
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.message || t('admin.createAccount.error'))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">{t('admin.createAccount.title')}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-500 p-3 rounded-md mb-4">
          {t('admin.createAccount.success')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('admin.createAccount.email')}
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
            {t('admin.createAccount.password')}
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
          {t('admin.createAccount.submit')}
        </button>
      </form>
    </div>
  )
}