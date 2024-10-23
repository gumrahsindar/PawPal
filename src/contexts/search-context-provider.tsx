'use client'

import { useState, createContext } from 'react'

type SearchContextProviderProps = {
  children: React.ReactNode
}

type TSearchContext = {
  searchQuery: string
  handleChangeSearchQuery: (newValue: string) => void
}

export const SearchContext = createContext<TSearchContext | null>(null)

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [searchQuery, setSearchQuery] = useState('')

  // derived state

  // handlers
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue)
  }

  console.log('searchQuery', searchQuery)

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
