"use client"

import { createCheckoutSession } from "@/actions/actions"
import H1 from "@/components/h1"
import { Button } from "@/components/ui/button"
import { use, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [isPending, startTransition] = useTransition()
  const { data: session, update, status } = useSession()
  const router = useRouter()

  // searchParams Promise'ını resolve etmek için use() hook'unu kullan
  const resolvedSearchParams = use(searchParams)

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PawPal access requires payment</H1>

      {resolvedSearchParams.success && (
        <Button
          onClick={async () => {
            await update(true)
            router.push("/app/dashboard")
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}

      {!resolvedSearchParams.success && (
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

      {!resolvedSearchParams.success && (
        <p className="text-sm text-red-500">
          For test payment, use card number 4242 4242 4242 4242, any future
          date, and any CVC.
        </p>
      )}

      {resolvedSearchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PawPal.{" "}
        </p>
      )}
      {resolvedSearchParams.canceled && (
        <p className="text-sm text-red-700">
          Payment canceled. You can try again.
        </p>
      )}
    </main>
  )
}
