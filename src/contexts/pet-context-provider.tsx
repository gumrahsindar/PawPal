'use client'

import { addPet } from '@/actions/actions'
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
  handleCheckOutPet: (id: string) => void
  selectedPet: Pet | undefined
  numberOfPets: number
  handleAddPet: (newPet: Omit<Pet, 'id'>) => void
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => void
}

export const PetContext = createContext<TPetContext | null>(null)

export default function PetContextProvider({
  data: pets,
  children,
}: PetContextProviderProps) {
  // state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId)
  const numberOfPets = pets.length

  // handlers
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    // setPets((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     ...newPet,
    //   },
    // ])
    await addPet(newPet)
  }

  const handleEditPet = (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            id: petId,
            ...newPetData,
          }
        }
        return pet
      })
    )
  }

  const handleCheckOutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id))
    setSelectedPetId(null)
  }

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
        handleCheckOutPet,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  )
}
