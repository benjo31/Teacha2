import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../lib/hooks/useAdmin'
import { useAuth } from '../../lib/context/AuthContext'
import { useTranslation } from '../../lib/context/LanguageContext'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isAdmin, loading } = useAdmin()
  const { t } = useTranslation()

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}