'use client'

import usePetContext from '@/lib/hooks/usePetContext'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { addPet, updatePet } from '@/actions/actions'
import PetFormBtn from './pet-form-btn'
import { toast } from 'sonner'

type PetFormProps = {
  actionType: 'edit' | 'add'
  onFormSubmission: () => void
}

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet } = usePetContext()

  return (
    <form
      action={async (formData) => {
        if (actionType === 'add') {
          const error = await addPet(formData)
          if (error) {
            toast.warning(error.message)
            return
          }
        } else if (actionType === 'edit') {
          if (actionType === 'edit') {
            const error = await updatePet(formData, selectedPet?.id)
            if (error) {
              toast.warning(error.message)
              return
            }
          }
          onFormSubmission()
        }
      }}
    >
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            type='text'
            name='name'
            required
            defaultValue={actionType === 'edit' ? selectedPet?.name : ''}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='owner-name'>Owner Name</Label>
          <Input
            id='owner-name'
            type='text'
            name='owner-name'
            required
            defaultValue={actionType === 'edit' ? selectedPet?.ownerName : ''}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='image-url'>Image Url</Label>
          <Input
            id='image-url'
            type='text'
            name='image-url'
            defaultValue={actionType === 'edit' ? selectedPet?.imageUrl : ''}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input
            id='age'
            type='number'
            name='age'
            defaultValue={actionType === 'edit' ? selectedPet?.age : ''}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='notes'>Note</Label>
          <Textarea
            id='notes'
            rows={3}
            name='notes'
            defaultValue={actionType === 'edit' ? selectedPet?.notes : ''}
          />
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  )
}
