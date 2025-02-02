import { z } from 'zod'

export const schoolTeacherSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['teacher', 'admin']).default('teacher'),
  status: z.enum(['pending', 'active']).default('pending'),
  createdAt: z.any()
})