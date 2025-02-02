import { motion } from 'framer-motion'
import { 
  UserPlus, Search, MessageSquare, Calendar,
  ClipboardCheck, CheckCircle, School, GraduationCap
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const teacherSteps = [
  {
    icon: UserPlus,
    title: "1. Créez votre profil",
    description: "Inscrivez-vous en tant que remplaçant et complétez votre profil avec vos compétences et disponibilités."
  },
  {
    icon: Search,
    title: "2. Trouvez des missions",
    description: "Parcourez les offres de remplacement qui correspondent à votre profil et à vos critères."
  },
  {
    icon: MessageSquare,
    title: "3. Postulez simplement",
    description: "Candidatez en quelques clics et échangez directement avec les établissements."
  },
  {
    icon: Calendar,
    title: "4. Gérez vos missions",
    description: "Suivez vos candidatures et organisez votre planning de remplacements."
  }
]

const schoolSteps = [
  {
    icon: UserPlus,
    title: "1. Inscrivez votre école",
    description: "Créez le profil de votre établissement et précisez vos besoins spécifiques."
  },
  {
    icon: ClipboardCheck,
    title: "2. Publiez vos besoins",
    description: "Créez des offres de remplacement détaillées en quelques minutes."
  },
  {
    icon: CheckCircle,
    title: "3. Sélectionnez vos remplaçants",
    description: "Examinez les candidatures et choisissez le profil idéal pour votre classe."
  },
  {
    icon: MessageSquare,
    title: "4. Communiquez directement",
    description: "Échangez avec les candidats et organisez les remplacements efficacement."
  }
]

export function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-6">Comment ça marche ?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RemplaceProf simplifie la mise en relation entre les écoles et les remplaçants. 
            Découvrez comment notre plateforme peut vous aider.
          </p>
        </motion.div>

        {/* Pour les remplaçants */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Pour les remplaçants</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {teacherSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Pour les écoles */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <School className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Pour les écoles</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {schoolSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Call to Action */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register?type=teacher" 
              className="btn btn-primary px-8 py-3"
            >
              Je suis remplaçant
            </a>
            <a 
              href="/register?type=school" 
              className="btn bg-white border border-gray-200 hover:bg-gray-50 px-8 py-3"
            >
              Je suis une école
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}