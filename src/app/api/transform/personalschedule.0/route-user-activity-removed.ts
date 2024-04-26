import { eq } from "drizzle-orm"

import { UserActivityRemovedEventPayload } from "@/contracts/events/user-activity"
import { db } from "@/database"
import { userActivities } from "@/database/schemas"

export default async function personalScheduleRemoved(payload: unknown) {
  console.log("Got removed personal schedule", payload)
  const parsedPayload = UserActivityRemovedEventPayload.parse(payload)
  const exists = await db.query.userActivities.findFirst({
    where: eq(userActivities.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db
    .delete(userActivities)
    .where(eq(userActivities.id, parsedPayload.id))
}
