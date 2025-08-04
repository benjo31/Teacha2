import { 
  Wallet, Target, ShieldCheck, MessageCircle,
  Clock, Users, Calendar, Sparkles,
  Bell, Map, BarChart, Briefcase,
  Zap, Award, Heart
} from 'lucide-react'

// These functions return benefit configurations with translation keys
// The actual translations are resolved in the components using useTranslation

export const getTeacherBenefits = (t: (key: string) => string) => [
  {
    icon: Wallet,
    title: t('landingPage.teacherBenefits.flexible.title'),
    description: t('landingPage.teacherBenefits.flexible.description')
  },
  {
    icon: Target,
    title: t('landingPage.teacherBenefits.targeted.title'),
    description: t('landingPage.teacherBenefits.targeted.description')
  },
  {
    icon: ShieldCheck,
    title: t('landingPage.teacherBenefits.simplified.title'),
    description: t('landingPage.teacherBenefits.simplified.description')
  },
  {
    icon: MessageCircle,
    title: t('landingPage.teacherBenefits.communication.title'),
    description: t('landingPage.teacherBenefits.communication.description')
  }
]

export const getSchoolBenefits = (t: (key: string) => string) => [
  {
    icon: Clock,
    title: t('landingPage.schoolBenefits.fast.title'),
    description: t('landingPage.schoolBenefits.fast.description')
  },
  {
    icon: Users,
    title: t('landingPage.schoolBenefits.talent.title'),
    description: t('landingPage.schoolBenefits.talent.description')
  },
  {
    icon: Calendar,
    title: t('landingPage.schoolBenefits.management.title'),
    description: t('landingPage.schoolBenefits.management.description')
  },
  {
    icon: Sparkles,
    title: t('landingPage.schoolBenefits.quality.title'),
    description: t('landingPage.schoolBenefits.quality.description')
  }
]

export const getFeatures = (t: (key: string) => string) => [
  {
    icon: Bell,
    title: t('landingPage.features.notifications.title'),
    description: t('landingPage.features.notifications.description')
  },
  {
    icon: Map,
    title: t('landingPage.features.geolocation.title'),
    description: t('landingPage.features.geolocation.description')
  },
  {
    icon: BarChart,
    title: t('landingPage.features.dashboard.title'),
    description: t('landingPage.features.dashboard.description')
  },
  {
    icon: Briefcase,
    title: t('landingPage.features.documents.title'),
    description: t('landingPage.features.documents.description')
  }
]

export const getPlatformAdvantages = (t: (key: string) => string) => [
  {
    icon: Zap,
    title: t('landingPage.platformAdvantages.speed.title'),
    description: t('landingPage.platformAdvantages.speed.description')
  },
  {
    icon: Award,
    title: t('landingPage.platformAdvantages.guarantee.title'),
    description: t('landingPage.platformAdvantages.guarantee.description')
  },
  {
    icon: Heart,
    title: t('landingPage.platformAdvantages.support.title'),
    description: t('landingPage.platformAdvantages.support.description')
  }
]

export const getTestimonials = (t: (key: string) => string) => [
  {
    name: t('landingPage.testimonials.marie.name'),
    role: t('landingPage.testimonials.marie.role'),
    content: t('landingPage.testimonials.marie.content'),
    rating: 5
  },
  {
    name: t('landingPage.testimonials.school.name'),
    role: t('landingPage.testimonials.school.role'),
    content: t('landingPage.testimonials.school.content'),
    rating: 5
  },
  {
    name: t('landingPage.testimonials.thomas.name'),
    role: t('landingPage.testimonials.thomas.role'),
    content: t('landingPage.testimonials.thomas.content'),
    rating: 5
  }
]