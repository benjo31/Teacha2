import { motion } from 'framer-motion'
import { 
  UserPlus, Search, MessageSquare, Calendar,
  ClipboardCheck, CheckCircle, School, GraduationCap
} from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'

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


export function HowItWorksPage() {
  const { t } = useTranslation()

  const teacherSteps = [
    {
      icon: UserPlus,
      title: t('howItWorks.teacher.step1.title'),
      description: t('howItWorks.teacher.step1.description')
    },
    {
      icon: Search,
      title: t('howItWorks.teacher.step2.title'),
      description: t('howItWorks.teacher.step2.description')
    },
    {
      icon: MessageSquare,
      title: t('howItWorks.teacher.step3.title'),
      description: t('howItWorks.teacher.step3.description')
    },
    {
      icon: Calendar,
      title: t('howItWorks.teacher.step4.title'),
      description: t('howItWorks.teacher.step4.description')
    }
  ]

  const schoolSteps = [
    {
      icon: UserPlus,
      title: t('howItWorks.school.step1.title'),
      description: t('howItWorks.school.step1.description')
    },
    {
      icon: ClipboardCheck,
      title: t('howItWorks.school.step2.title'),
      description: t('howItWorks.school.step2.description')
    },
    {
      icon: CheckCircle,
      title: t('howItWorks.school.step3.title'),
      description: t('howItWorks.school.step3.description')
    },
    {
      icon: MessageSquare,
      title: t('howItWorks.school.step4.title'),
      description: t('howItWorks.school.step4.description')
    }
  ]

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
          <h1 className="text-4xl font-bold mb-6">{t('howItWorks.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
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
            <h2 className="text-2xl font-bold">{t('howItWorks.forTeachers')}</h2>
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
            <h2 className="text-2xl font-bold">{t('howItWorks.forSchools')}</h2>
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
            {t('howItWorks.cta.title')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register?type=teacher" 
              className="btn btn-primary px-8 py-3"
            >
              {t('howItWorks.cta.teacher')}
            </a>
            <a 
              href="/register?type=school" 
              className="btn bg-white border border-gray-200 hover:bg-gray-50 px-8 py-3"
            >
              {t('howItWorks.cta.school')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}