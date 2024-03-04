import { eq } from "drizzle-orm"

import { ConferenceEventUpdatedPayload } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import { updateProduct } from "@/lib/stripe/product"

export default async function conferenceUpdated(payload: unknown) {
  console.log("Got updated event", payload)
  const parsedPayload = ConferenceEventUpdatedPayload.parse(payload)
  const exists = await db.query.conferences.findFirst({
    where: eq(conferences.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await updateProduct({
    id: exists.stripeId,
    name: parsedPayload.name,
    description: parsedPayload.ticketDescription,
    price: parsedPayload.ticketPrice,
    currency: parsedPayload.ticketCurrency,
  })

  await db
    .update(conferences)
    .set(parsedPayload)
    .where(eq(conferences.id, parsedPayload.id))
}
