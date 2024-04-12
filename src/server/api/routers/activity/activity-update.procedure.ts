import { and, eq, type SQL } from "drizzle-orm"

import { UpdateActivityInputDto } from "@/contracts/activity/activity"
import { sendActivityUpdatedEvent } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const updateActivityProcedure = protectedProcedure
  .input(UpdateActivityInputDto)
  .mutation(async ({ input }) => {
    if (
      !(await db.query.activities.findFirst({
        where: and(eq(activities.id, input.id), eq(activities.archived, false)),
      }))
    ) {
      throw new Error("Activity not found")
    }

    await sendActivityUpdatedEvent({ ...input })
    try {
      const condition: SQL<unknown>[] = [
        eq(activities.id, input.id),
        ...(input.title ? [eq(activities.title, input.title)] : []),
        ...(input.imageUrl ? [eq(activities.imageUrl, input.imageUrl)] : []),
        ...(input.introText ? [eq(activities.introText, input.introText)] : []),
        ...(input.fullText ? [eq(activities.fullText, input.fullText)] : []),
        ...(input.stageName ? [eq(activities.stageName, input.stageName)] : []),
        ...(input.startTime ? [eq(activities.startTime, input.startTime)] : []),
        ...(input.endTime ? [eq(activities.endTime, input.endTime)] : []),
        ...(input.publicVisibility
          ? [eq(activities.publicVisibility, input.publicVisibility)]
          : []),
        ...(input.publishedAt
          ? [eq(activities.publishedAt, input.publishedAt)]
          : []),
        eq(activities.archived, false),
        ...(input.reason ? [eq(activities.reason, input.reason)] : []),
      ]

      await waitForPredicate(
        () =>
          db.query.activities.findFirst({
            where: and(...condition),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
