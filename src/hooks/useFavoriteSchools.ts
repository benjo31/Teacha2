import { useState, useEffect } from 'react'
import { getFavoriteSchools } from '../lib/services/favorites'

export function useFavoriteSchools(teacherId: string | undefined) {
  const [favoriteSchools, setFavoriteSchools] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      if (!teacherId) {
        setFavoriteSchools([])
        setLoading(false)
        return
      }

      try {
        const favorites = await getFavoriteSchools(teacherId)
        setFavoriteSchools(favorites)
      } catch (error) {
        console.error('Error loading favorite schools:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [teacherId])

  const toggleFavorite = (schoolId: string, isFavorite: boolean) => {
    setFavoriteSchools(prev => 
      isFavorite 
        ? [...prev, schoolId]
        : prev.filter(id => id !== schoolId)
    )
  }

  return {
    favoriteSchools,
    loading,
    toggleFavorite
  }
}