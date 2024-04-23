import { clerkClient, getAuth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import shortUuid from "short-uuid"
import { z } from "zod"

import { payment } from "@/cloud"
import { db } from "@/database"
import { events, users } from "@/database/schemas"

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

    const { data: price, error: priceError } = await payment.tryGetPrice(
      event?.stripeId,
    )

    if (!priceError || !price) {
      return NextResponse.json({ error: "Price not found" }, { status: 400 })
    }

    const ticketIds = Array.from({ length: body.quantity }, () =>
      shortUuid.generate(),
    )

    const sessionId = await payment.createSessionId({
      priceId: price.id,
      quantity: body.quantity,
      userId: user.id,
      emailAddress: clerkUser.emailAddresses[0]?.emailAddress,
      successUrl: `${request.headers.get("origin")}/me/tickets?success=true&eventid=${body.eventId}&tickets=${ticketIds.join(",")}`,
      cancelUrl: `${request.headers.get("origin")}/me/tickets?success=false`,
      metadata: {
        eventId: body.eventId,
        ticketIds: ticketIds.join(","),
      },
    })

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Session creation failed" },
      { status: 500 },
    )
  }
}
