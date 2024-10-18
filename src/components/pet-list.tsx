'use client'

import usePetContext from '@/lib/hooks/usePetContext'
import Image from 'next/image'

export default function PetList() {
  const { pets } = usePetContext()
  return (
    <ul className='bg-white border-b border-black/[0.08]'>
      {pets.map((pet) => (
        <li key={pet.id}>
          <button className='flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-[#eff1f2] focus:[bg-[#eff1f2] transition-colors]'>
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
