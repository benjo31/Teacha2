import { z } from 'zod'

export const applicationSchema = z.object({
  teacherId: z.string(),
  offerId: z.string(),
  schoolId: z.string(), // Ajout du schoolId
  message: z.string().min(1, 'Un message est requis').max(500, 'Le message ne doit pas dépasser 500 caractères'),
  status: z.enum(['pending', 'accepted']).default('pending'),
})