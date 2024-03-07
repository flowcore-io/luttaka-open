import { eq } from "drizzle-orm"

import { ConferenceEventArchivedPayload } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import { archiveProduct } from "@/lib/stripe/product"

export default async function conferenceArchived(payload: unknown) {
  console.log("Got archived event", payload)
  const parsedPayload = ConferenceEventArchivedPayload.parse(payload)
  const exists = await db.query.conferences.findFirst({
    where: eq(conferences.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await archiveProduct(exists.stripeId)

  await db
    .update(conferences)
    .set({
      archived: true,
    })
    .where(eq(conferences.id, parsedPayload.id))
}
