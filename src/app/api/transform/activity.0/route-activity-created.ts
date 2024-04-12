import { eq } from "drizzle-orm"

import { ActivityEventCreatedPayload } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"

export default async function activityCreated(payload: unknown) {
  console.log("Got created activity", payload)
  const parsedPayload = ActivityEventCreatedPayload.parse(payload)
  const exists = await db.query.activities.findFirst({
    where: eq(activities.id, parsedPayload.id),
  })
  if (exists) {
    return
  }

  await db.insert(activities).values(parsedPayload)
}
