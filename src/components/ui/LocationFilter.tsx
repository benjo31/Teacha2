import { MapPin } from 'lucide-react'

interface LocationFilterProps {
  userCity?: string
  onFilter: (enabled: boolean) => void
  enabled: boolean
}

export function LocationFilter({ userCity, onFilter, enabled }: LocationFilterProps) {
  if (!userCity) return null

  return (
    <button
      onClick={() => onFilter(!enabled)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        enabled
          ? 'bg-primary text-primary-foreground'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <MapPin className="h-4 w-4" />
      <span>Offres près de chez moi</span>
    </button>
  )
}