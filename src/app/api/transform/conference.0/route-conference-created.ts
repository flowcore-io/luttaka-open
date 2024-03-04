import { eq } from "drizzle-orm"

import { ConferenceEventCreatedPayload } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import { createProduct } from "@/lib/stripe/product"

export default async function conferenceCreated(payload: unknown) {
  console.log("Got created event", payload)
  const parsedPayload = ConferenceEventCreatedPayload.parse(payload)
  const exists = await db.query.conferences.findFirst({
    where: eq(conferences.id, parsedPayload.id),
  })
  if (exists) {
    return
  }

  await createProduct({
    id: parsedPayload.stripeId,
    conferenceId: parsedPayload.id,
    name: parsedPayload.name,
    price: parsedPayload.ticketPrice,
    currency: parsedPayload.ticketCurrency,
    description: parsedPayload.ticketDescription,
  })

  await db.insert(conferences).values(parsedPayload)
}
