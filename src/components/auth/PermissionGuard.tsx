import { ReactNode } from 'react'
import { usePermissions } from '../../lib/hooks/usePermissions'
import { Permission } from '../../lib/schemas/permissions'

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading } = usePermissions()

  if (loading) {
    return null // or a loading spinner
  }

  if (!checkPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RoleGuardProps {
  roles: ('director' | 'teacher')[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { userRole, loading } = usePermissions()

  if (loading) {
    return null
  }

  if (!userRole || !roles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}