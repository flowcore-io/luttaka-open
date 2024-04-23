import { eq } from "drizzle-orm"

import { payment } from "@/cloud"
import { EventEventCreatedPayload } from "@/contracts/events/event"
import { db } from "@/database"
import { events } from "@/database/schemas"

export default async function eventCreated(payload: unknown) {
  console.log("Got created event", payload)
  const parsedPayload = EventEventCreatedPayload.parse(payload)
  const exists = await db.query.events.findFirst({
    where: eq(events.id, parsedPayload.id),
  })
  if (exists) {
    return
  }

  const productId = parsedPayload.productId ?? parsedPayload.stripeId
  if (!productId) {
    throw new Error("Product ID or Stripe ID is required")
  }

  await payment.createProduct({
    id: productId,
    eventId: parsedPayload.id,
    name: parsedPayload.name,
    price: parsedPayload.ticketPrice,
    currency: parsedPayload.ticketCurrency,
    description: parsedPayload.ticketDescription,
  })

  await db.insert(events).values({
    ...parsedPayload,
    productId,
  })
}
