import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/context/AuthContext'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [userStatus, setUserStatus] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    async function checkUserStatus() {
      if (!user) {
        setCheckingStatus(false)
        return
      }

      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
        const schoolDoc = await getDoc(doc(db, 'schools', user.uid))

        if (teacherDoc.exists()) {
          setUserStatus(teacherDoc.data().status)
        } else if (schoolDoc.exists()) {
          setUserStatus(schoolDoc.data().status)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error)
      }

      setCheckingStatus(false)
    }

    checkUserStatus()
  }, [user])

  if (loading || checkingStatus) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (userStatus === 'pending') {
    return <Navigate to="/pending-approval" replace />
  }

  if (userStatus !== 'approved') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}