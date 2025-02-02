import { Play } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface DemoVideoProps {
  thumbnailUrl?: string
}

export function DemoVideo({ thumbnailUrl }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative max-w-4xl mx-auto mt-12 rounded-2xl overflow-hidden shadow-2xl">
      {!isPlaying ? (
        <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt="Aperçu de la vidéo" 
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="relative z-10 w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center group"
          >
            <Play className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors ml-1" />
          </motion.button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="text-xl font-semibold mb-2">
              Découvrez Teacha en action
            </h3>
            <p className="text-white/80">
              Une démonstration rapide de notre plateforme de gestion des remplacements
            </p>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            src="VOTRE_URL_VIDEO"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}