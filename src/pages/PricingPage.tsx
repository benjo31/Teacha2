import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'



export function PricingPage() {
  const { t } = useTranslation()
  
  const teacherBenefits = [
    t('pricing.teacher.benefits.unlimited'),
    t('pricing.teacher.benefits.profile'),
    t('pricing.teacher.benefits.messaging'),
    t('pricing.teacher.benefits.applications'),
    t('pricing.teacher.benefits.notifications'),
    t('pricing.teacher.benefits.documents'),
    t('pricing.teacher.benefits.tracking'),
    t('pricing.teacher.benefits.support')
  ]

  const schoolBenefits = [
    t('pricing.school.benefits.unlimited'),
    t('pricing.school.benefits.profiles'),
    t('pricing.school.benefits.messaging'),
    t('pricing.school.benefits.applications'),
    t('pricing.school.benefits.notifications'),
    t('pricing.school.benefits.dashboard'),
    t('pricing.school.benefits.history'),
    t('pricing.school.benefits.support')
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
          <h1 className="text-4xl font-bold mb-6">{t('pricing.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Plans de tarification */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Remplaçants */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border p-8"
          >
            <h2 className="text-2xl font-bold mb-2">{t('pricing.teacher.title')}</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">{t('pricing.teacher.price')}</span>
              <span className="text-gray-500">{t('pricing.teacher.duration')}</span>
            </div>

            <div className="space-y-4">
              {teacherBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <a
              href="/register?type=teacher"
              className="btn btn-primary w-full mt-8"
            >
              {t('pricing.teacher.cta')}
            </a>
          </motion.div>

          {/* Plan Écoles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border p-8 relative overflow-hidden"
          >
            {/* Badge Projet Pilote */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <AlertCircle className="h-3.5 w-3.5" />
                {t('pricing.school.badge')}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">{t('pricing.school.title')}</h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">{t('pricing.school.price')}</span>
              <span className="text-gray-500">{t('pricing.school.duration')}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {t('pricing.school.instead')}
            </p>

            <div className="space-y-4">
              {schoolBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <a
                href="/register?type=school"
                className="btn btn-primary w-full"
              >
                {t('pricing.school.cta')}
              </a>
              <p className="text-sm text-center text-gray-500">
                {t('pricing.school.limitation')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          className="mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.faq.title')}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.duration.question')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq.duration.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.after.question')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq.after.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.hidden.question')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq.hidden.answer')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}