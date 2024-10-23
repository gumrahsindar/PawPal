'use client'

import useSearchContext from '@/lib/hooks/useSearchContext'

export default function SearchForm() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext()
  return (
    <form className='w-full h-full'>
      <input
        type='search'
        className='w-full h-full bg-white/20 rounded-md  outline-none transition focus:bg-white/50 hover:bg-white/30 px-3 placeholder:text-white/50'
        placeholder='Search for a pet'
        value={searchQuery}
        onChange={(event) => {
          handleChangeSearchQuery(event.target.value)
        }}
      />
    </form>
  )
}
