import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/context/AuthContext'
import { useTranslation } from '../lib/context/LanguageContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useEffect, useState } from 'react'
import { HeroSection } from '../components/landing/HeroSection'
import { fadeIn, stagger } from '../lib/animations'
import { 
  getTeacherBenefits,
  getSchoolBenefits,
  getFeatures,
  getPlatformAdvantages,
  getTestimonials
} from '../lib/constants/landing'
import { Star } from 'lucide-react'

export function LandingPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  
  // Get translated content
  const teacherBenefits = getTeacherBenefits(t)
  const schoolBenefits = getSchoolBenefits(t)
  const features = getFeatures(t)
  const platformAdvantages = getPlatformAdvantages(t)
  const testimonials = getTestimonials(t)
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null)
  const [heroRef, heroInView] = useInView({ triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    async function checkUserType() {
      if (!user) {
        setUserType(null)
        return
      }

      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      const schoolDoc = await getDoc(doc(db, 'schools', user.uid))

      if (teacherDoc.exists()) {
        setUserType('teacher')
      } else if (schoolDoc.exists()) {
        setUserType('school')
      }
    }

    checkUserType()
  }, [user])

  function renderActionButtons() {
    if (userType === 'teacher') {
      return (
        <div className="flex justify-center">
          <Link 
            to="/teacher-home"
            className="btn btn-primary px-[26px] py-4 text-lg flex items-center justify-center gap-2 w-64"
          >
            {t('common.dashboard')}
          </Link>
        </div>
      )
    }

    if (userType === 'school') {
      return (
        <div className="flex justify-center">
          <Link 
            to="/school-home"
            className="btn btn-primary px-[26px] py-4 text-lg flex items-center justify-center gap-2 w-64"
          >
            {t('common.dashboard')}
          </Link>
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/register?type=teacher"
          className="btn btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2"
        >
          {t('landing.hero.cta.teacher')}
        </Link>
        <Link 
          to="/register?type=school"
          className="btn btn-secondary px-8 py-4 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {t('landing.hero.cta.school')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Orbes lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[500px] h-[500px] -left-64 -top-64" />
        <div className="orb orb-blue w-[600px] h-[600px] -right-96 -bottom-96" />
      </div>

      {/* Hero Section */}
      <HeroSection 
        renderActionButtons={renderActionButtons}
        heroRef={heroRef}
        heroInView={heroInView}
      />

      {/* Section Avantages */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            ref={benefitsRef}
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={stagger}
            className="space-y-20"
          >
            {/* Pour les remplaçants */}
            <div>
              <motion.div variants={fadeIn} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t('landing.benefits.teacher.title')}</h2>
                <p className="text-xl text-gray-600">
                  {t('landingPage.teacherSubtitle')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teacherBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="card p-6 hover:-translate-y-1"
                  >
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pour les écoles */}
            <div>
              <motion.div variants={fadeIn} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t('landing.benefits.school.title')}</h2>
                <p className="text-xl text-gray-600">
                  {t('landingPage.schoolSubtitle')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {schoolBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="card p-6 hover:-translate-y-1"
                  >
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-gradient-to-b from-white to-primary/5 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('landingPage.featuresTitle')}</h2>
              <p className="text-xl text-gray-600">
                {t('landingPage.featuresSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="flex items-start space-x-4"
                >
                  <div className="rounded-lg bg-white p-3 shadow-md">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Avantages Plateforme */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('landing.benefits.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('landingPage.platformSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platformAdvantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="text-center"
                >
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('landing.testimonials.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('landingPage.testimonialsSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="card p-6 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card p-12">
              <h2 className="text-3xl font-bold mb-6">
                {t('landing.cta.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('landingPage.ctaSubtitle')}
              </p>
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}