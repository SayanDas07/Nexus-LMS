import { z } from 'zod'

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(100, 'Content must be less than 100 words')
    .refine(
      (content) => content.trim().split(/\s+/).length <= 100,
      'Content must be less than 100 words'
    )
})

export type NoticeFormData = z.infer<typeof noticeSchema>