import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendActivityArchivedEvent } from "@/contracts/events/activity"
import { db } from "@/database"
import { activities } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveActivityInputDto = z.object({
  id: z.string(),
})

export type ArchiveActivityInput = z.infer<typeof ArchiveActivityInputDto>

export const archiveActivityProcedure = protectedProcedure
  .input(ArchiveActivityInputDto)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ input }) => {
    await sendActivityArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () =>
          db.query.activities.findFirst({
            where: and(
              eq(activities.id, input.id),
              eq(activities.archived, true),
            ),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
