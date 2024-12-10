'use server'

import { signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { sleep } from '@/lib/utils'
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { checkAuth, getPetById } from '@/lib/server-utils'
import { Prisma } from '@prisma/client'

// -- user actions --
export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000)

  // check if formData is a FormData object
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    }
  }

  // convert FormData to object
  const formDataEntries = Object.fromEntries(formData.entries())

  // validation
  const validatedFormData = authSchema.safeParse(formDataEntries)

  if (!validatedFormData.success) {
    return {
      message: 'Invalid form data.',
    }
  }

  const { email, password } = validatedFormData.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          message: 'Email already exists.',
        }
      }
    }
  }

  await signIn('credentials', formData)
}

export async function logIn(formData: unknown) {
  await sleep(1000)

  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    }
  }

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
  const pet = await getPetById(validatedPetId.data)

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
  const pet = await getPetById(validatedPetId.data)

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
