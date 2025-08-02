import { LoginForm } from '../components/auth/LoginForm'
import { useTranslation } from '../lib/context/LanguageContext'

export function LoginPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">{t('auth.login.title')}</h1>
      <LoginForm />
    </div>
  )
}