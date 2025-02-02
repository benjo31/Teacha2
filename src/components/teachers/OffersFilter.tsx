import { MultiSelect } from '../ui/MultiSelect'
import { SUBJECTS, TEACHING_LEVELS } from '../../lib/constants'
import { LocationFilter } from '../ui/LocationFilter'
import { Star } from 'lucide-react'

interface OffersFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedSubjects: string[]
  onSubjectsChange: (values: string[]) => void
  selectedLevels: string[]
  onLevelsChange: (values: string[]) => void
  locationSearch: string
  onLocationChange: (value: string) => void
  userCity?: string
  localOffersEnabled: boolean
  onLocalOffersChange: (enabled: boolean) => void
  showFavoritesOnly: boolean
  onFavoritesChange: (enabled: boolean) => void
}

export function OffersFilter({
  searchTerm,
  onSearchChange,
  selectedSubjects,
  onSubjectsChange,
  selectedLevels,
  onLevelsChange,
  locationSearch,
  onLocationChange,
  userCity,
  localOffersEnabled,
  onLocalOffersChange,
  showFavoritesOnly,
  onFavoritesChange
}: OffersFilterProps) {
  const locationValue = locationSearch ? [locationSearch] : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre par branches */}
        <div>
          <MultiSelect
            label="Branches"
            options={SUBJECTS}
            value={selectedSubjects}
            onChange={onSubjectsChange}
            searchable
          />
        </div>

        {/* Filtre par niveaux */}
        <div>
          <MultiSelect
            label="Niveaux"
            options={TEACHING_LEVELS}
            value={selectedLevels}
            onChange={onLevelsChange}
            searchable
          />
        </div>

        {/* Filtre par lieu */}
        <div>
          <MultiSelect
            label="Lieu"
            options={[]}
            value={locationValue}
            onChange={(values) => onLocationChange(values[0] || '')}
            searchable
            allowCustomValue
            placeholder="Entrez une ville ou une commune..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Filtre écoles favorites */}
        <button
          onClick={() => onFavoritesChange(!showFavoritesOnly)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFavoritesOnly
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          <span>Écoles favorites uniquement</span>
        </button>

        {/* Filtre de proximité */}
        {userCity && (
          <LocationFilter
            userCity={userCity}
            onFilter={onLocalOffersChange}
            enabled={localOffersEnabled}
          />
        )}
      </div>
    </div>
  )
}