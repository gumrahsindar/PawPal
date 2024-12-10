'use client'

import { useTransition } from 'react'
import { Button } from './ui/button'
import { logOut } from '@/actions/actions'

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          await logOut()
        })
      }}
      disabled={isPending}
    >
      Sign out
    </Button>
  )
}
