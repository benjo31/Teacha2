import { z } from 'zod'
import { TEACHING_LEVELS, SUBJECTS, CANTONS, CIVILITY, NATIVE_LANGUAGES } from '../constants'

export const teacherProfileSchema = z.object({
  id: z.string(),
  civility: z.enum(CIVILITY, {
    errorMap: () => ({ message: 'La civilité est requise' })
  }),
  nativeLanguage: z.enum(NATIVE_LANGUAGES, {
    errorMap: () => ({ message: 'La langue natale est requise' })
  }),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  age: z.number().min(18, 'Vous devez avoir au moins 18 ans'),
  phone: z.string().optional(),
  street: z.string().min(2, 'La rue est requise'),
  zipCode: z.string().min(4, 'Le NPA doit contenir au moins 4 caractères'),
  city: z.string().min(2, 'La ville est requise'),
  canton: z.enum(CANTONS, {
    errorMap: () => ({ message: 'Le canton est requis' })
  }),
  teachingLevels: z.array(z.enum(TEACHING_LEVELS)).min(1, 'Sélectionnez au moins un niveau'),
  subjects: z.array(z.string()).min(1, 'Sélectionnez au moins une branche'),
  photoUrl: z.string().optional(),
  photoPath: z.string().optional(),
  cvUrl: z.string().optional(),
  cvPath: z.string().optional()
})