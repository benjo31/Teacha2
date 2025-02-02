import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={cn(
            "input",
            error && "border-error focus:border-error focus:ring-error/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)