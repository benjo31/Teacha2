import { Users, AlertTriangle } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

interface InvitationLimitIndicatorProps {
  used: number
  max: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function InvitationLimitIndicator({ 
  used, 
  max, 
  size = 'md', 
  showIcon = true 
}: InvitationLimitIndicatorProps) {
  const { t } = useTranslation()
  
  const percentage = (used / max) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = used >= max
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }
  
  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {showIcon && (
        <div className={`
          ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-500'}
        `}>
          {isAtLimit || isNearLimit ? (
            <AlertTriangle className={iconSizes[size]} />
          ) : (
            <Users className={iconSizes[size]} />
          )}
        </div>
      )}
      
      <div className="flex flex-col">
        <div className={`font-medium ${
          isAtLimit ? 'text-red-700' : isNearLimit ? 'text-yellow-700' : 'text-gray-700'
        }`}>
          {t('team.invitationLimit', { used, max })}
        </div>
        
        {/* Progress bar */}
        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className={`h-2 rounded-full transition-all ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {isAtLimit && (
          <div className="text-xs text-red-600 mt-1">
            {t('team.limitReached')}
          </div>
        )}
        
        {isNearLimit && !isAtLimit && (
          <div className="text-xs text-yellow-600 mt-1">
            {t('team.nearLimit')}
          </div>
        )}
      </div>
    </div>
  )
}