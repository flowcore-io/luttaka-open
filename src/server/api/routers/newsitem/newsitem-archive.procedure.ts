import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendNewsitemArchivedEvent } from "@/contracts/events/newsitem"
import { db } from "@/database"
import { newsitems } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveNewsitemInputDto = z.object({
  id: z.string(),
})

export type ArchiveNewsitemInput = z.infer<typeof ArchiveNewsitemInputDto>

export const archiveNewsitemProcedure = protectedProcedure
  .input(ArchiveNewsitemInputDto)
  .mutation(async ({ input }) => {
    await sendNewsitemArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () =>
          db.query.newsitems.findFirst({
            where: and(
              eq(newsitems.id, input.id),
              eq(newsitems.archived, true),
            ),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
