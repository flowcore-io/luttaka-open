import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendCompanyArchivedEvent } from "@/contracts/events/company"
import { db } from "@/database"
import { companies } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveCompanyInputDto = z.object({
  id: z.string(),
})

export type ArchiveCompanyInput = z.infer<typeof ArchiveCompanyInputDto>

export const archiveCompanyProcedure = protectedProcedure
  .input(ArchiveCompanyInputDto)
  .mutation(async ({ input }) => {
    await sendCompanyArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () =>
          db.query.companies.findFirst({
            where: and(
              eq(companies.id, input.id),
              eq(companies.archived, true),
            ),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
