import { Shield, User } from 'lucide-react'
import { Role } from '../../lib/schemas/permissions'
import { useTranslation } from '../../lib/context/LanguageContext'

interface UserRoleBadgeProps {
  role: Role
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function UserRoleBadge({ role, size = 'md', showIcon = true }: UserRoleBadgeProps) {
  const { t } = useTranslation()
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm', 
    lg: 'px-4 py-2 text-base'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const roleConfig = {
    director: {
      label: t('roles.director'),
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20',
      icon: Shield
    },
    teacher: {
      label: t('roles.teacher'), 
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: User
    }
  }
  
  const config = roleConfig[role]
  const IconComponent = config.icon
  
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full border font-medium
      ${sizeClasses[size]}
      ${config.bgColor}
      ${config.textColor}
      ${config.borderColor}
    `}>
      {showIcon && <IconComponent className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}