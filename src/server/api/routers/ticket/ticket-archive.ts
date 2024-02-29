import { eq } from "drizzle-orm"
import { z } from "zod"

import { sendTicketArchivedEvent } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const ArchiveTicketInput = z.object({
  id: z.string(),
})

export const archiveTicketRouter = protectedProcedure
  .input(ArchiveTicketInput)
  .mutation(async ({ input }) => {
    // TODO: Check if user is allowed to archive ticket
    await sendTicketArchivedEvent({ id: input.id })
    try {
      await waitForPredicate(
        () => db.query.tickets.findFirst({ where: eq(tickets.id, input.id) }),
        (result) => !result,
      )
      return true
    } catch (error) {
      return false
    }
  })
