'use client'

import { createCheckoutSession } from '@/actions/actions'
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [isPending, startTransition] = useTransition()
  const { update } = useSession()
  const router = useRouter()

  return (
    <main className='flex flex-col items-center space-y-10'>
      <H1>PawPal access requires payment</H1>

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true)
            router.push('/app/dashboard')
          }}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession()
            })
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}

      {searchParams.success && (
        <p className='text-sm text-green-700'>
          Payment successful! You now have lifetime access to PawPal.{' '}
        </p>
      )}
      {searchParams.canceled && (
        <p className='text-sm text-red-700'>
          Payment canceled. You can try again.
        </p>
      )}
    </main>
  )
}
