import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendConferenceArchivedEvent } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveConferenceInputDto = z.object({
  id: z.string(),
})

export type ArchiveConferenceInput = z.infer<typeof ArchiveConferenceInputDto>

export const archiveConferenceRouter = protectedProcedure
  .input(ArchiveConferenceInputDto)
  .mutation(async ({ input }) => {
    await sendConferenceArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () =>
          db.query.conferences.findFirst({
            where: and(
              eq(conferences.id, input.id),
              eq(conferences.archived, true),
            ),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
