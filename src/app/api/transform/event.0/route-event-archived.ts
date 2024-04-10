import { eq } from "drizzle-orm"

import { EventEventArchivedPayload } from "@/contracts/events/event"
import { db } from "@/database"
import { events } from "@/database/schemas"

export default async function eventArchived(payload: unknown) {
  console.log("Got archived event", payload)
  const parsedPayload = EventEventArchivedPayload.parse(payload)
  const exists = await db.query.events.findFirst({
    where: eq(events.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db
    .update(events)
    .set({
      archived: true,
    })
    .where(eq(events.id, parsedPayload.id))
}
