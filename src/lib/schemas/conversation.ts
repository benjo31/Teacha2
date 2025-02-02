import { z } from 'zod'

export const conversationSchema = z.object({
  participants: z.record(z.boolean()).optional(),
  lastMessageAt: z.any(),
  lastMessage: z.string().optional(),
  unreadCount: z.record(z.number()).default({}),
  type: z.enum(['teacher_school']),
  metadata: z.object({
    teacherId: z.string(),
    teacherName: z.string(),
    schoolId: z.string(),
    schoolName: z.string(),
    offerId: z.string().optional(),
    offerSubject: z.string().optional()
  })
})

export type ConversationType = z.infer<typeof conversationSchema>