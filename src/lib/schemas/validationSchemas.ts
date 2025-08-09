import { z } from 'zod'
import { getCantons, getTeachingLevels, getCivility, getNativeLanguages, getSpecialClasses } from '../constants'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 Mo
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export function createTeacherSchema(t: (key: string, params?: any) => string) {
  return z.object({
    civility: z.enum(getCivility(t) as any, {
      errorMap: () => ({ message: t('validation.civilityRequired') })
    }),
    nativeLanguage: z.enum(getNativeLanguages(t) as any, {
      errorMap: () => ({ message: t('validation.nativeLanguageRequired') })
    }),
    firstName: z.string().min(2, t('validation.minLength', { min: 2 })),
    lastName: z.string().min(2, t('validation.minLength', { min: 2 })),
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.minLength', { min: 8 })),
    age: z.number().min(18, t('validation.minAge', { age: 18 })),
    phone: z.string().optional(),
    street: z.string().min(2, t('validation.streetRequired')),
    zipCode: z.string().min(4, t('validation.minLength', { min: 4 })),
    city: z.string().min(2, t('validation.cityRequired')),
    canton: z.enum(getCantons(t) as any, {
      errorMap: () => ({ message: t('validation.cantonRequired') })
    }),
    teachingLevels: z.array(z.enum(getTeachingLevels(t) as any)).min(1, t('validation.selectAtLeastOneLevel')),
    subjects: z.array(z.string()).min(1, t('validation.selectAtLeastOneSubject')),
    cv: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, t('validation.fileSizeLimit', { size: 2 }))
      .refine(
        (file) => file.type === 'application/pdf',
        t('validation.pdfOnly')
      )
      .optional(),
    photo: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, t('validation.fileSizeLimit', { size: 2 }))
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        t('validation.imageFormat')
      )
      .optional(),
  })
}

export function createSchoolSchema(t: (key: string, params?: any) => string) {
  return z.object({
    name: z.string().min(2, t('validation.schoolNameRequired')),
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.minLength', { min: 8 })),
    address: z.string().min(5, t('validation.addressRequired')),
    canton: z.enum(getCantons(t) as any, {
      errorMap: () => ({ message: t('validation.cantonRequired') })
    }),
    teachingLevels: z.array(z.string()).min(1, t('validation.selectAtLeastOneLevel')),
    classCount: z.number().min(1, t('validation.classCountRequired')),
    description: z.string().max(500, t('validation.maxLength', { max: 500 })).optional(),
    website: z.string().url(t('validation.invalidUrl')).optional().or(z.literal('')),
    specialClasses: z.array(z.enum(getSpecialClasses(t) as any)).optional().default([]),
    pedagogicalProjects: z.string().max(500, t('validation.maxLength', { max: 500 })).optional(),
    contactPerson: z.object({
      name: z.string().min(2, t('validation.nameRequired')),
      role: z.string().min(2, t('validation.roleRequired')),
      phone: z.string().min(10, t('validation.phoneRequired')),
      email: z.string().email(t('validation.email'))
    }),
    schedule: z.object({
      morningStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('validation.invalidTimeFormat')),
      morningEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('validation.invalidTimeFormat')),
      afternoonStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('validation.invalidTimeFormat')),
      afternoonEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('validation.invalidTimeFormat'))
    }),
    plan: z.object({
      name: z.enum(['basic', 'premium']).default('basic'),
      maxInvitations: z.number().default(20),
      usedInvitations: z.number().default(0)
    }).optional()
  }).transform((data) => {
    // Remove undefined and empty string values
    const cleaned: any = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        cleaned[key] = value
      }
    })
    return cleaned
  })
}