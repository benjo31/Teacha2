import { cn } from '../../lib/utils'

interface UnreadBadgeProps {
  count: number
  className?: string
}

export function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count === 0) return null

  return (
    <span 
      className={cn(
        "flex items-center justify-center min-w-[1.25rem] h-5 px-1.5",
        "rounded-full bg-primary text-primary-foreground text-xs font-medium",
        className
      )}
    >
      {count}
    </span>
  )
}