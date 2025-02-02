import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
]

export const messageSchema = z.object({
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string().min(1, 'Le message ne peut pas être vide'),
  attachments: z.array(z.object({
    file: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, 'Le fichier ne doit pas dépasser 5 Mo')
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        'Format accepté : PDF, JPG ou PNG'
      ),
    type: z.enum(['pdf', 'image']),
    name: z.string()
  })).optional(),
  createdAt: z.any()
})