import { and, eq } from "drizzle-orm"
import shortUuid from "short-uuid"

import { CreateActivityInputDto } from "@/contracts/activity/activity"
import {
  sendActivityArchivedEvent,
  sendActivityCreatedEvent,
} from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const createActivityProcedure = protectedProcedure
  .input(CreateActivityInputDto)
  .mutation(async ({ input }) => {
    // TODO: make sure user has correct permissions

    if (
      await db.query.activities.findFirst({
        where: and(
          eq(activities.title, input.title),
          eq(activities.archived, false),
        ),
      })
    ) {
      throw new Error("Activity with that name already exists")
    }

    const id = shortUuid.generate()

    await sendActivityCreatedEvent({
      ...input,
      id,
      imageUrl: input.imageUrl ?? "",
      introText: input.introText ?? "",
      fullText: input.fullText ?? "",
      stageName: input.stageName ?? "",
      startTime: input.startTime ?? "",
      endTime: input.endTime ?? "",
    })
    try {
      await waitForPredicate(
        () =>
          db.query.activities.findFirst({
            where: eq(activities.id, id),
          }),
        (result) => {
          console.log("result", result)
          return !!result
        },
      )
    } catch (error) {
      await sendActivityArchivedEvent({
        id: id,
        _reason: "rollback",
      })
      throw new Error("Activity creation failed, rolling back")
    }
    return id
  })
