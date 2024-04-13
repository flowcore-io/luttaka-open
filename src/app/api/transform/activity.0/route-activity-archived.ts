import { eq } from "drizzle-orm"

import { ActivityEventArchivedPayload } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"

export default async function activityArchived(payload: unknown) {
  console.log("Got archived activity", payload)
  const parsedPayload = ActivityEventArchivedPayload.parse(payload)
  const exists = await db.query.activities.findFirst({
    where: eq(activities.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db
    .update(activities)
    .set({
      archived: true,
    })
    .where(eq(activities.id, parsedPayload.id))
}
