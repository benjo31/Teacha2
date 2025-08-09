import { z } from 'zod'

export const teamInvitationSchema = z.object({
  schoolId: z.string(),
  schoolName: z.string(),
  email: z.string().email(),
  role: z.enum(['school_admin', 'school_teacher']).default('school_teacher'),
  status: z.enum(['pending', 'accepted', 'rejected', 'expired']).default('pending'),
  invitedBy: z.string(),
  invitedByName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  message: z.string().optional(),
  token: z.string(),
  expiresAt: z.any(),
  createdAt: z.any(),
  updatedAt: z.any().optional(),
  acceptedAt: z.any().optional(),
  rejectedAt: z.any().optional(),
  acceptedBy: z.string().optional()
})

export type TeamInvitation = z.infer<typeof teamInvitationSchema>