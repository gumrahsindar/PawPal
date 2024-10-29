'use client'

import usePetContext from '@/lib/hooks/usePetContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

type PetFormProps = {
  actionType: 'edit' | 'add'
  onFormSubmission: () => void
}

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet } = usePetContext()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get('name') as string,
      ownerName: formData.get('owner-name') as string,
      imageUrl:
        (formData.get('image-url') as string) ||
        'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
      age: Number(formData.get('age')),
      notes: formData.get('notes') as string,
    }
    handleAddPet(data)
    onFormSubmission()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' type='text' name='name' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='owner-name'>Owner Name</Label>
          <Input id='owner-name' type='text' name='owner-name' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='image-url'>Image Url</Label>
          <Input id='image-url' type='text' name='image-url' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input id='age' type='number' name='age' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='notes'>Note</Label>
          <Textarea id='notes' rows={3} name='notes' />
        </div>
      </div>
      <Button type='submit' className='mt-5 self-end'>
        {actionType === 'add' ? 'Add Pet' : 'Edit Pet'}
      </Button>
    </form>
  )
}