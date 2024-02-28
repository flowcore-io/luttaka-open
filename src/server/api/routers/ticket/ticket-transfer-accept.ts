import {
  sendTicketTransferAcceptedEvent,
  sendTicketUpdatedEvent,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

const AcceptTicketTransferInput = z.object({
  transferId: z.string(),
})

export const acceptTicketTransferRouter = protectedProcedure
  .input(AcceptTicketTransferInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id
    const ticketTransfer = await db.query.ticketTransfers.findFirst({
      where: and(
        eq(ticketTransfers.id, input.transferId),
        eq(ticketTransfers.state, "open"),
      ),
    })
    if (!ticketTransfer) {
      throw new Error("Invalid redeem code")
    }
    const ticket = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.id, ticketTransfer.ticketId),
        eq(tickets.state, "open"),
      ),
    })
    if (!ticket) {
      throw new Error("Ticket not found")
    }
    try {
      await sendTicketUpdatedEvent({ id: ticket.id, userId })
      await sendTicketTransferAcceptedEvent({ transferId: input.transferId })
      await waitForPredicate(
        () =>
          db.query.ticketTransfers.findFirst({
            where: eq(ticketTransfers.id, input.transferId),
          }),
        (result) => result?.state === "accepted",
      )
    } catch (error) {
      console.log(error)
      return false
    }
    return true
  })
