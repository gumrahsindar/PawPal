'use server'

import prisma from '@/lib/db'

export async function addPet(formData) {
  console.log(formData)
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
}
