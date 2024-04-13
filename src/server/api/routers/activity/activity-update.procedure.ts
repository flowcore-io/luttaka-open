import { and, eq, type SQL } from "drizzle-orm"

import { UpdateActivityInputDto } from "@/contracts/activity/activity"
import { sendActivityUpdatedEvent } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

export const updateActivityProcedure = protectedProcedure
  .input(UpdateActivityInputDto)
  .use(adminsOnlyMiddleware)
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
        ...(input.imageBase64
          ? [eq(activities.imageBase64, input.imageBase64)]
          : []),
        ...(input.description
          ? [eq(activities.description, input.description)]
          : []),
        ...(input.stageName ? [eq(activities.stageName, input.stageName)] : []),
        ...(input.startTime ? [eq(activities.startTime, input.startTime)] : []),
        ...(input.endTime ? [eq(activities.endTime, input.endTime)] : []),
        ...(input.publicVisibility
          ? [eq(activities.publicVisibility, input.publicVisibility)]
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
