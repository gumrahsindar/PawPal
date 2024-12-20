'use client'

import usePetContext from '@/lib/hooks/usePetContext'
import useSearchContext from '@/lib/hooks/useSearchContext'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext()
  const { searchQuery } = useSearchContext()

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery)
  )

  return (
    <ul className='bg-white border-b border-light'>
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => {
              handleChangeSelectedPetId(pet.id)
            }}
            className={cn(
              'flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-[#eff1f2] focus:[bg-[#eff1f2] transition-colors]',
              {
                'bg-[#eff1f2]': selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              width={45}
              height={45}
              className='size-[45px] rounded-full object-cover'
            />
            <p className='font-semibold'>{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
