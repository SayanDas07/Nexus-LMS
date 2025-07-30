import { z } from 'zod'

export const noteSchema = z.object({
  noteName: z.string().min(1, 'Note name is required').max(200, 'Note name must be less than 200 characters'),
  noteTopic: z.string().min(1, 'Topic is required').max(200, 'Topic must be less than 200 characters'),
  notesLinks: z.array(z.string().url('Invalid URL format')).min(1, 'At least one link is required')
})

export type NoteFormData = z.infer<typeof noteSchema>