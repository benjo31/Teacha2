import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid))
      setIsAdmin(adminDoc.exists())
      setLoading(false)
    }

    checkAdminStatus()
  }, [user])

  return { isAdmin, loading }
}