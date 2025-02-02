import { z } from 'zod'
import { SUBJECTS, TEACHING_LEVELS } from '../constants'

export const replacementOfferSchema = z.object({
  schoolId: z.string(),
  class: z.string().min(1, 'La classe est requise'),
  location: z.string().min(1, 'Le lieu est requis'),
  subjects: z.array(z.string()).min(1, 'Sélectionnez au moins une branche'),
  teachingLevel: z.enum(TEACHING_LEVELS, {
    errorMap: () => ({ message: 'Le niveau d\'enseignement est requis' })
  }),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  totalLessons: z.number().min(1, 'Le nombre de leçons est requis'),
  periods: z.array(z.enum(['morning', 'afternoon'])).min(1, 'Sélectionnez au moins une période'),
  topic: z.string().optional(),
  qualifications: z.string().optional(),
  status: z.enum(['active', 'filled', 'expired']).default('active')
})

export type ReplacementOffer = z.infer<typeof replacementOfferSchema>