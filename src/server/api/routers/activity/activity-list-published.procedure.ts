import { and, eq, lt } from "drizzle-orm"

import { db } from "@/database"
import { activities } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getActivityPublishedProcedure = protectedProcedure.query(
  async () => {
    return (
      (await db
        .select({
          id: activities.id,
          title: activities.title,
          imageUrl: activities.imageUrl,
          introText: activities.introText,
          fullText: activities.fullText,
          stageName: activities.stageName,
          startTime: activities.startTime,
          endTime: activities.endTime,
          publicVisibility: activities.publicVisibility,
          publishedAt: activities.publishedAt,
          archived: activities.archived,
          reason: activities.reason,
        })
        .from(activities)
        .where(
          and(
            eq(activities.archived, false),
            lt(activities.publishedAt, new Date().toISOString()),
          ),
        )
        .execute()) || []
    )
  },
)
