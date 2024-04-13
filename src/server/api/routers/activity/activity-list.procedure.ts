import { eq } from "drizzle-orm"

import { db } from "@/database"
import { activities } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const listActivitiesProcedure = protectedProcedure.query(async () => {
  return (
    (await db
      .select({
        id: activities.id,
        title: activities.title,
        imageBase64: activities.imageBase64,
        description: activities.description,
        stageName: activities.stageName,
        startTime: activities.startTime,
        endTime: activities.endTime,
        publicVisibility: activities.publicVisibility,
        archived: activities.archived,
        reason: activities.reason,
      })
      .from(activities)
      .where(eq(activities.archived, false))
      .execute()) || []
  )
})
