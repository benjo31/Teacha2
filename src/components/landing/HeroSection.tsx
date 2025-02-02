import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { fadeIn } from '../../lib/animations'
import { DemoVideo } from './DemoVideo'

interface HeroSectionProps {
  renderActionButtons: () => React.ReactNode
  heroRef: any
  heroInView: boolean
}

export function HeroSection({ renderActionButtons, heroRef, heroInView }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-grid" />
      
      <div className="container mx-auto px-4 pt-20 pb-16 relative">
        <motion.div 
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 text-primary mb-8"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">La solution innovante pour les remplacements scolaires</span>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Teacha - La première plateforme de mise en relation école-remplaçants en Suisse
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-600 mb-12"
          >
            Simplifiez la gestion des remplacements scolaires grâce à notre solution innovante qui connecte intelligemment les écoles avec des remplaçants qualifiés.
          </motion.p>

          <motion.div variants={fadeIn}>
            {renderActionButtons()}
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="mt-12"
          >
            <DemoVideo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}