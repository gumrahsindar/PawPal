import { z } from 'zod'

export type TPetForm = z.infer<typeof petFormSchema>

export const petIdSchema = z.string().cuid()

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: 'Owner name is required' })
      .max(100),
    imageUrl: z.union([
      z.literal(''),
      z.string().url({ message: 'Image url must be a valid URL' }),
    ]),
    age: z.coerce.number().int().positive().max(99999),
    notes: z.union([z.literal(''), z.string().trim().max(500)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
  }))
