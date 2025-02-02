import { z } from 'zod'
import { CANTONS, TEACHING_LEVELS, CIVILITY, NATIVE_LANGUAGES, SUBJECTS, SPECIAL_CLASSES } from '../constants'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 Mo
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const teacherSchema = z.object({
  civility: z.enum(CIVILITY, {
    errorMap: () => ({ message: 'La civilité est requise' })
  }),
  nativeLanguage: z.enum(NATIVE_LANGUAGES, {
    errorMap: () => ({ message: 'La langue natale est requise' })
  }),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
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
  cv: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Le fichier ne doit pas dépasser 2 Mo')
    .refine(
      (file) => file.type === 'application/pdf',
      'Seuls les fichiers PDF sont acceptés'
    )
    .optional(),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'L\'image ne doit pas dépasser 2 Mo')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format accepté : JPG ou PNG'
    )
    .optional(),
})

export const schoolSchema = z.object({
  name: z.string().min(2, 'Le nom de l\'école est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  address: z.string().min(5, 'L\'adresse est requise'),
  canton: z.enum(CANTONS, {
    errorMap: () => ({ message: 'Le canton est requis' })
  }),
  teachingLevels: z.array(z.string()).min(1, 'Sélectionnez au moins un niveau'),
  classCount: z.number().min(1, 'Le nombre de classes est requis'),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
  website: z.string().url('URL invalide').optional(),
  specialClasses: z.array(z.enum(SPECIAL_CLASSES)).optional(),
  pedagogicalProjects: z.string().max(500, 'La description des projets ne doit pas dépasser 500 caractères').optional(),
  contactPerson: z.object({
    name: z.string().min(2, 'Le nom est requis'),
    role: z.string().min(2, 'Le rôle est requis'),
    phone: z.string().min(10, 'Le numéro de téléphone est requis'),
    email: z.string().email('Email invalide')
  }),
  schedule: z.object({
    morningStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)'),
    morningEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)'),
    afternoonStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)'),
    afternoonEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)')
  })
})