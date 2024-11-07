'use server'

import prisma from '@/lib/db'
import { sleep } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function addPet(formData) {
  await sleep(2000)

  try {
    await prisma.pet.create({
      data: {
        name: formData.get('name'),
        ownerName: formData.get('owner-name'),
        age: parseInt(formData.get('age'), 10),
        imageUrl:
          formData.get('image-url') ||
          'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
        notes: formData.get('notes'),
      },
    })
  } catch (error) {
    return {
      message: 'Could not add pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function updatePet(formData, id) {
  await sleep(2000)

  try {
    await prisma.pet.update({
      where: {
        id,
      },
      data: {
        name: formData.get('name'),
        ownerName: formData.get('owner-name'),
        age: parseInt(formData.get('age'), 10),
        imageUrl:
          formData.get('image-url') ||
          'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
        notes: formData.get('notes'),
      },
    })
  } catch (error) {
    return {
      message: 'Could not update pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function deletePet(id) {
  await sleep(2000)

  try {
    await prisma.pet.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    return {
      message: 'Could not delete pet.',
    }
  }
  revalidatePath('/app', 'layout')
}
