import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { hasPermission, getUserPermissions, type Role, type Permission } from '../schemas/permissions'

export function usePermissions() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserRole() {
      if (!user) {
        setUserRole(null)
        setLoading(false)
        return
      }

      try {
        // Check if user is a school (director)
        const schoolDoc = await getDoc(doc(db, 'schools', user.uid))
        if (schoolDoc.exists()) {
          setUserRole('director')
          setLoading(false)
          return
        }

        // Check if user is a teacher
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
        if (teacherDoc.exists()) {
          // Check if this teacher is part of a school team
          // For now, all standalone teachers have teacher role
          setUserRole('teacher')
          setLoading(false)
          return
        }

        // If neither, user has no role
        setUserRole(null)
        setLoading(false)
      } catch (error) {
        console.error('Error loading user role:', error)
        setUserRole(null)
        setLoading(false)
      }
    }

    loadUserRole()
  }, [user])

  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return hasPermission(userRole, permission)
  }

  const getPermissions = (): Permission[] => {
    if (!userRole) return []
    return getUserPermissions(userRole)
  }

  return {
    userRole,
    loading,
    checkPermission,
    getPermissions,
    isDirector: userRole === 'director',
    isTeacher: userRole === 'teacher'
  }
}