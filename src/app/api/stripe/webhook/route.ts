import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { sendTicketCreatedEvent } from "@/contracts/events/ticket"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const stripeSignature = request.headers.get("stripe-signature")
  if (!stripeSignature) {
    console.error("No stripe signature")
    return NextResponse.json({ success: false }, { status: 400 })
  }
  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      process.env.WEBHOOK_SECRET!,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Webhook Error:", message)
    return NextResponse.json({ success: false }, { status: 400 })
  }

  console.log("Stripe Event", event.type)

  if (event.type === "checkout.session.completed") {
    const userId = event.data.object.client_reference_id
    const eventId = event.data.object.metadata?.eventId
    const ticketIds = event.data.object.metadata?.ticketIds?.split(",") ?? []
    if (!userId || !eventId || !ticketIds.length) {
      console.error("Invalid checkout session", {
        userId,
        eventId,
        ticketIds,
      })
      return NextResponse.json({ success: false }, { status: 400 })
    }
    for (const ticketId of ticketIds) {
      await sendTicketCreatedEvent({
        id: ticketId,
        userId,
        eventId,
        state: "open",
      })
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
