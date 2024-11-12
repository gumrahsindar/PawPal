'use server'

import prisma from '@/lib/db'
import { PetEssentials } from '@/lib/types'
import { sleep } from '@/lib/utils'
import { petFormSchema } from '@/lib/validations'
import { Pet } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function addPet(pet: PetEssentials) {
  await sleep(1000)

  const validatedPet = petFormSchema.safeParse(pet)
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data.',
    }
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    })
  } catch (error) {
    return {
      message: 'Could not add pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function updatePet(petId: Pet['id'], newPetData: PetEssentials) {
  await sleep(1000)

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: newPetData,
    })
  } catch (error) {
    return {
      message: 'Could not update pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function deletePet(id: Pet['id']) {
  await sleep(1000)

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
