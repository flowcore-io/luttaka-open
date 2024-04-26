import { eq } from "drizzle-orm"

import { UserActivityAddedEventPayload } from "@/contracts/events/user-activity"
import { db } from "@/database"
import { userActivities } from "@/database/schemas"

export default async function personalScheduleAdded(payload: unknown) {
  console.log("Got added personal schedule", payload)
  const parsedPayload = UserActivityAddedEventPayload.parse(payload)
  const exists = await db.query.userActivities.findFirst({
    where: eq(userActivities.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db.insert(userActivities).values(parsedPayload)
}
