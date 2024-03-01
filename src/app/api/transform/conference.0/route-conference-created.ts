import { eq } from "drizzle-orm"

import { ConferenceEventCreatedPayload } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"

export default async function conferenceCreated(payload: unknown) {
  console.log("Got created event", payload)
  const parsedPayload = ConferenceEventCreatedPayload.parse(payload)
  const exists = await db.query.conferences.findFirst({
    where: eq(conferences.id, parsedPayload.id),
  })
  if (exists) {
    return
  }
  await db.insert(conferences).values(parsedPayload)
}
