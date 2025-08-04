import { z } from 'zod'

export const roleSchema = z.enum(['director', 'teacher'])
export const permissionSchema = z.enum([
  // Team management
  'team:invite',
  'team:remove',
  'team:view_all',
  'team:manage_roles',
  
  // Offers management
  'offers:create',
  'offers:view_all',
  'offers:view_own',
  'offers:edit_all',
  'offers:edit_own',
  'offers:delete_all',
  'offers:delete_own',
  
  // Applications management
  'applications:view_all',
  'applications:view_own',
  'applications:manage_all',
  'applications:manage_own',
  
  // School settings
  'school:edit_profile',
  'school:manage_settings',
  'school:manage_billing',
  
  // Messages
  'messages:send',
  'messages:view',
  
  // Profile management
  'profile:edit_own',
  'profile:view_own'
])

export type Role = z.infer<typeof roleSchema>
export type Permission = z.infer<typeof permissionSchema>

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  director: [
    // Team management - full access
    'team:invite',
    'team:remove', 
    'team:view_all',
    'team:manage_roles',
    
    // Offers - full access
    'offers:create',
    'offers:view_all',
    'offers:edit_all',
    'offers:delete_all',
    
    // Applications - full access
    'applications:view_all',
    'applications:manage_all',
    
    // School settings - full access
    'school:edit_profile',
    'school:manage_settings',
    'school:manage_billing',
    
    // Communication
    'messages:send',
    'messages:view',
    
    // Personal profile
    'profile:edit_own',
    'profile:view_own'
  ],
  
  teacher: [
    // Limited offers access
    'offers:create',
    'offers:view_own',
    'offers:edit_own',
    'offers:delete_own',
    
    // Limited applications access
    'applications:view_own',
    'applications:manage_own',
    
    // Communication
    'messages:send',
    'messages:view',
    
    // Personal profile only
    'profile:edit_own',
    'profile:view_own'
  ]
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

export function getUserPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}