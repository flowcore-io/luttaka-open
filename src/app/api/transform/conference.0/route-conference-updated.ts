import { eq } from "drizzle-orm"

import { ConferenceEventUpdatedPayload } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"

export default async function conferenceUpdated(payload: unknown) {
  console.log("Got updated event", payload)
  const parsedPayload = ConferenceEventUpdatedPayload.parse(payload)
  const exists = await db.query.conferences.findFirst({
    where: eq(conferences.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }
  await db
    .update(conferences)
    .set(parsedPayload)
    .where(eq(conferences.id, parsedPayload.id))
}
