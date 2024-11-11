'use client'

import usePetContext from '@/lib/hooks/usePetContext'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import PetFormBtn from './pet-form-btn'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type PetFormProps = {
  actionType: 'edit' | 'add'
  onFormSubmission: () => void
}

type TPetForm = z.infer<typeof petFormSchema>

const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).max(100),
  'owner-name': z
    .string()
    .trim()
    .min(1, { message: 'Owner name is required' })
    .max(100),
  'image-url': z.union([
    z.literal(''),
    z.string().url({ message: 'Image url must be a valid URL' }),
  ]),
  age: z.coerce.number().int().positive().max(99999),
  notes: z.string().trim().max(500).optional(),
})

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext()

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  })

  return (
    <form
      action={async (formData) => {
        const result = await trigger()
        if (!result) return
        onFormSubmission()
        const petData = {
          name: formData.get('name') as string,
          ownerName: formData.get('owner-name') as string,
          imageUrl:
            (formData.get('image-url') as string) ||
            'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
          age: Number(formData.get('age')),
          notes: formData.get('notes') as string,
        }
        if (actionType === 'add') {
          await handleAddPet(petData)
        } else if (actionType === 'edit') {
          await handleEditPet(selectedPet!.id, petData)
        }
      }}
    >
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' {...register('name')} />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='owner-name'>Owner Name</Label>
          <Input id='owner-name' {...register('owner-name')} />
          {errors['owner-name'] && (
            <p className='text-red-500'>{errors['owner-name'].message}</p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='image-url'>Image Url</Label>
          <Input id='image-url' {...register('image-url')} />
          {errors['image-url'] && (
            <p className='text-red-500'>{errors['image-url'].message}</p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input id='age' {...register('age')} />
          {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='notes'>Note</Label>
          <Textarea id='notes' {...register('notes')} />
          {errors.notes && (
            <p className='text-red-500'>{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  )
}
