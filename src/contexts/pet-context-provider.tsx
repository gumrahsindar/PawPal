'use client'

import { Pet } from '@/lib/types'
import { useState, createContext } from 'react'

type PetContextProviderProps = {
  data: Pet[]
  children: React.ReactNode
}

type TPetContext = {
  pets: Pet[]
  selectedPetId: string | null
  handleChangeSelectedPetId: (id: string) => void
  selectedPet: Pet | undefined
  numberOfPets: number
}

export const PetContext = createContext<TPetContext | null>(null)

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState<Pet[]>(data)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId)
  const numberOfPets = pets.length

  // handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id)
  }

  console.log(selectedPetId)
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  )
}
