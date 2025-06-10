import prisma from "@/lib/db"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log("Webhook verification failed", error)
    return new Response("Webhook Error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    await prisma.user.update({
      where: {
        email: event.data.object.customer_email,
      },
      data: { hasAccess: true },
    })
  } else {
    console.log("Unhandled event type", event.type)
  }

  return new Response("OK", { status: 200 })
}
