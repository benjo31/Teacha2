import { useState } from 'react'
import { Star } from 'lucide-react'
import { addSchoolToFavorites, removeSchoolFromFavorites } from '../../lib/services/favorites'

interface FavoriteSchoolButtonProps {
  teacherId: string
  schoolId: string
  isFavorite: boolean
  onToggle: (isFavorite: boolean) => void
}

export function FavoriteSchoolButton({ 
  teacherId, 
  schoolId, 
  isFavorite, 
  onToggle 
}: FavoriteSchoolButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeSchoolFromFavorites(teacherId, schoolId)
      } else {
        await addSchoolToFavorites(teacherId, schoolId)
      }
      onToggle(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-gray-400 hover:text-gray-500'
      }`}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  )
}