import { eq } from "drizzle-orm"

import { sendTicketUpdatedEvent } from "@/contracts/events/ticket"
import { UpdateTicketInputDto } from "@/contracts/ticket/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { verifyThat } from "@/server/api/routers/middlewares/verify/verify-processes.middleware"
import { protectedProcedure } from "@/server/api/trpc"

export const updateTicketProcedure = protectedProcedure
  .input(UpdateTicketInputDto)
  .use(verifyThat.userOwnsTicket)
  .mutation(async ({ input }) => {
    await sendTicketUpdatedEvent({
      id: input.id,
      eventId: input.eventId,
      note: input.note,
    })
    try {
      await waitForPredicate(
        () => db.query.tickets.findFirst({ where: eq(tickets.id, input.id) }),
        (result) => result?.note === input.note,
      )
    } catch (error) {
      console.error("Failed to update ticket", error)
      return false
    }
    return true
  })
