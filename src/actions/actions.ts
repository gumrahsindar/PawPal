'use server'

import { signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { sleep } from '@/lib/utils'
import { petFormSchema, petIdSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { checkAuth } from '@/lib/server-utils'

// -- user actions --
export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get('password') as string,
    10
  )

  await prisma.user.create({
    data: {
      email: formData.get('email') as string,
      hashedPassword,
    },
  })

  await signIn('credentials', formData)
}

export async function logIn(formData: FormData) {
  await signIn('credentials', formData)

  redirect('/app/dashboard')
}

export async function logOut() {
  await signOut({ redirectTo: '/' })
}

// -- pet actions --
export async function addPet(pet: unknown) {
  await sleep(1000)

  const session = await checkAuth()

  const validatedPet = petFormSchema.safeParse(pet)
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data.',
    }
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: { id: session.user.id },
        },
      },
    })
  } catch (error) {
    return {
      message: 'Could not add pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function updatePet(petId: unknown, newPetData: unknown) {
  await sleep(1000)

  // authentication check
  const session = await checkAuth()

  // validate
  const validatedPetId = petIdSchema.safeParse(petId)

  const validatedPet = petFormSchema.safeParse(newPetData)
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: 'Invalid pet data.',
    }
  }

  // authorization check (user owns pet)
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
    select: {
      userId: true,
    },
  })

  if (!pet || pet.userId !== session.user.id) {
    return {
      message: 'You do not have permission to update this pet.',
    }
  }

  // db mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    })
  } catch (error) {
    return {
      message: 'Could not update pet.',
    }
  }
  revalidatePath('/app', 'layout')
}

export async function deletePet(id: unknown) {
  await sleep(1000)

  // authentication check
  const session = await checkAuth()

  // validate
  const validatedPetId = petIdSchema.safeParse(id)

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet id.',
    }
  }

  // authorization check (user owns pet)
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
    select: {
      userId: true,
    },
  })

  if (!pet || pet.userId !== session.user.id) {
    return {
      message: 'You do not have permission to delete this pet.',
    }
  }

  // db mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    })
  } catch (error) {
    return {
      message: 'Could not delete pet.',
    }
  }
  revalidatePath('/app', 'layout')
}
