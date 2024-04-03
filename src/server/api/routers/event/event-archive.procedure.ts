import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendEventArchivedEvent } from "@/contracts/events/event"
import { db } from "@/database"
import { events } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveEventInputDto = z.object({
  id: z.string(),
})

export type ArchiveEventInput = z.infer<typeof ArchiveEventInputDto>

export const archiveEventProcedure = protectedProcedure
  .input(ArchiveEventInputDto)
  .mutation(async ({ input }) => {
    await sendEventArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () =>
          db.query.events.findFirst({
            where: and(eq(events.id, input.id), eq(events.archived, true)),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
