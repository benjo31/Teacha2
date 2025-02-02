import { z } from 'zod'

export const notificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['application', 'status_update', 'offer_filled']),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  createdAt: z.any(),
  link: z.string().optional(),
})