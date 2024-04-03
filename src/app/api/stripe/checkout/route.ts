import { clerkClient, getAuth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import shortUuid from "short-uuid"
import Stripe from "stripe"
import { z } from "zod"

import { db } from "@/database"
import { events, users } from "@/database/schemas"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const CheckoutRequest = z.object({
  eventId: z.string(),
  quantity: z.number().min(1).default(1),
})

export async function POST(request: NextRequest) {
  const auth = getAuth(request)
  if (!auth.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  const clerkUser = await clerkClient.users.getUser(auth.userId)
  const user = await db.query.users.findFirst({
    where: eq(users.externalId, auth.userId),
  })
  if (!user || !clerkUser) {
    return NextResponse.json({ error: "No user" }, { status: 400 })
  }

  try {
    const bodyRaw: unknown = await request.json()
    const body = CheckoutRequest.parse(bodyRaw)
    const event = await db.query.events.findFirst({
      where: eq(events.id, body.eventId),
    })
    const prices = await stripe.prices.list({
      lookup_keys: [`standard_${event?.stripeId}`],
    })
    const price = prices.data[0]
    if (!price) {
      return NextResponse.json({ error: "Price not found" }, { status: 400 })
    }
    const ticketIds = Array.from({ length: body.quantity }, () =>
      shortUuid.generate(),
    )
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: body.quantity,
          price: price.id,
        },
      ],
      client_reference_id: user.id,
      customer_email: clerkUser.emailAddresses[0]?.emailAddress,
      metadata: {
        eventId: body.eventId,
        ticketIds: ticketIds.join(","),
      },
      mode: "payment",
      success_url: `${request.headers.get("origin")}/me/tickets?success=true&tickets=${ticketIds.join(",")}`,
      cancel_url: `${request.headers.get("origin")}/me/tickets?success=false`,
    })
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Session creation failed" },
      { status: 500 },
    )
  }
}
