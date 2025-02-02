import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../lib/hooks/useAdmin'
import { useAuth } from '../../lib/context/AuthContext'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}