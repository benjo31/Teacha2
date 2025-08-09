import { z } from 'zod'

export const schoolTeacherSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['director', 'teacher']).default('teacher'),
  status: z.enum(['pending', 'active', 'rejected']).default('pending'),
  invitedBy: z.string(), // ID of the user who sent the invitation
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  teacherId: z.string().optional(), // Links to actual teacher profile when accepted
  createdAt: z.any(),
  updatedAt: z.any().optional(),
  acceptedAt: z.any().optional()
})

export const schoolPlanSchema = z.object({
  name: z.enum(['basic', 'premium']).default('basic'),
  maxInvitations: z.number().default(20),
  usedInvitations: z.number().default(0),
  features: z.array(z.string()).default(['team_management', 'basic_support'])
})

export type SchoolTeacher = z.infer<typeof schoolTeacherSchema>
export type SchoolPlan = z.infer<typeof schoolPlanSchema>