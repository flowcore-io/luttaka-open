import { and, eq, type SQL } from "drizzle-orm"

import { UpdateEventInputDto } from "@/contracts/event/event"
import { sendEventUpdatedEvent } from "@/contracts/events/event"
import { db } from "@/database"
import { events } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

export const updateEventProcedure = protectedProcedure
  .input(UpdateEventInputDto)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ input }) => {
    if (
      !(await db.query.events.findFirst({
        where: and(eq(events.id, input.id), eq(events.archived, false)),
      }))
    ) {
      throw new Error("Event not found")
    }

    await sendEventUpdatedEvent({ ...input })
    try {
      const condition: SQL<unknown>[] = [
        eq(events.id, input.id),
        eq(events.archived, false),
        ...(input.name ? [eq(events.name, input.name)] : []),
        ...(input.description
          ? [eq(events.description, input.description)]
          : []),
        ...(input.startDate ? [eq(events.startDate, input.startDate)] : []),
        ...(input.endDate ? [eq(events.endDate, input.endDate)] : []),
      ]

      await waitForPredicate(
        () =>
          db.query.events.findFirst({
            where: and(...condition),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
