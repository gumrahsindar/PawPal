'use client'

import { addPet, deletePet, updatePet } from '@/actions/actions'
import { Pet } from '@/lib/types'
import { useState, createContext, useOptimistic } from 'react'
import { toast } from 'sonner'

type PetContextProviderProps = {
  data: Pet[]
  children: React.ReactNode
}

type TPetContext = {
  pets: Pet[]
  selectedPetId: string | null
  handleChangeSelectedPetId: (id: string) => void
  handleCheckOutPet: (id: string) => Promise<void>
  selectedPet: Pet | undefined
  numberOfPets: number
  handleAddPet: (newPet: Omit<Pet, 'id'>) => Promise<void>
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => Promise<void>
}

export const PetContext = createContext<TPetContext | null>(null)

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (prev, { action, payload }) => {
      if (action === 'add') {
        return [...prev, { ...payload, id: Math.random().toString() }]
      }
      if (action === 'edit') {
        return prev.map((pet) => {
          if (pet.id === payload.id) {
            return { ...pet, ...payload.newPetData }
          }
          return pet
        })
      }
      if (action === 'delete') {
        return prev.filter((pet) => pet.id !== payload)
      }
      return prev
    }
  )
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId)
  const numberOfPets = optimisticPets.length

  // handlers
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    setOptimisticPets({ action: 'add', payload: newPet })
    const error = await addPet(newPet)
    if (error) {
      toast.warning(error.message)
      return
    }
  }

  const handleEditPet = async (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setOptimisticPets({ action: 'edit', payload: { id: petId, newPetData } })
    const error = await updatePet(petId, newPetData)
    if (error) {
      toast.warning(error.message)
      return
    }
  }

  const handleCheckOutPet = async (petId: string) => {
    setOptimisticPets({ action: 'delete', payload: petId })
    const error = await deletePet(petId)
    if (error) {
      toast.warning(error.message)
      return
    }
    setSelectedPetId(null)
  }

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id)
  }

  console.log(selectedPetId)
  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
