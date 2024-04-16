import { eq } from "drizzle-orm"

import { ActivityEventUpdatedPayload } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"

export default async function activityUpdated(payload: unknown) {
  console.log("Got updated activity", payload)
  const parsedPayload = ActivityEventUpdatedPayload.parse(payload)
  const exists = await db.query.activities.findFirst({
    where: eq(activities.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db
    .update(activities)
    .set(parsedPayload)
    .where(eq(activities.id, parsedPayload.id))
}
