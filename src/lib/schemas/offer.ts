import { z } from 'zod'

export const createReplacementOfferSchema = (t: (key: string) => string) => z.object({
  schoolId: z.string(),
  class: z.string().min(1, t('validation.class')),
  location: z.string().min(1, t('validation.location')),
  subjects: z.array(z.string()).min(1, t('validation.subjects')),
  teachingLevel: z.string().min(1, t('validation.teachingLevel')),
  startDate: z.string().min(1, t('validation.startDate')),
  endDate: z.string().min(1, t('validation.endDate')),
  totalLessons: z.number().min(1, t('validation.totalLessons')),
  periods: z.array(z.enum(['morning', 'afternoon'])).min(1, t('validation.periods')),
  topic: z.string().optional(),
  qualifications: z.string().optional(),
  status: z.enum(['active', 'filled', 'expired']).default('active')
})

// For backward compatibility - uses French as default
export const replacementOfferSchema = createReplacementOfferSchema((key) => {
  const messages: Record<string, string> = {
    'validation.class': 'La classe est requise',
    'validation.location': 'Le lieu est requis',
    'validation.subjects': 'Sélectionnez au moins une branche',
    'validation.teachingLevel': 'Le niveau d\'enseignement est requis',
    'validation.startDate': 'La date de début est requise',
    'validation.endDate': 'La date de fin est requise',
    'validation.totalLessons': 'Le nombre de leçons est requis',
    'validation.periods': 'Sélectionnez au moins une période'
  }
  return messages[key] || key
})

export type ReplacementOffer = z.infer<typeof replacementOfferSchema>