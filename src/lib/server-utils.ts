import "server-only"

import { redirect } from "next/navigation"
import { auth } from "./auth"
import { Pet, User } from "@prisma/client"
import prisma from "./db"

export async function checkAuth() {
  try {
    const session = await auth()
    if (!session?.user) {
      redirect("/login")
    }
    return session
  } catch (error) {
    console.error("Auth check failed:", error)
    redirect("/login")
  }
}

export async function getUserByEmail(email: User["email"]) {
  // Email validation
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    })
    return user
  } catch (error) {
    console.error("Failed to get user by email:", error)
    return null
  }
}

export async function getPetById(petId: Pet["id"]) {
  // ID validation
  if (!petId || typeof petId !== "string") {
    return null
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      select: {
        userId: true,
      },
    })
    return pet
  } catch (error) {
    console.error("Failed to get pet by ID:", error)
    return null
  }
}

export async function getPetsByUserId(userId: User["id"]) {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        userId,
      },
    })
    return pets
  } catch (error) {
    console.error("Failed to get pets by user ID:", error)
    return []
  }
}

// Yeni güvenlik kontrolü fonksiyonu
export async function checkPetOwnership(petId: Pet["id"], userId: User["id"]) {
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      select: {
        userId: true,
      },
    })

    if (!pet || pet.userId !== userId) {
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to check pet ownership:", error)
    return false
  }
}
