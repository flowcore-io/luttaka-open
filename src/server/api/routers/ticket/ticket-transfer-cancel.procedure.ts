import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendTicketTransferCancelledEvent } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketTransfers } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const CancelTicketTransferInput = z.object({
  transferId: z.string(),
})

export const cancelTicketTransferProcedure = protectedProcedure
  .input(CancelTicketTransferInput)
  .mutation(async ({ input }) => {
    const ticketTransfer = await db.query.ticketTransfers.findFirst({
      where: and(
        eq(ticketTransfers.id, input.transferId),
        eq(ticketTransfers.state, "open"),
      ),
    })
    if (!ticketTransfer) {
      return
    }
    try {
      await sendTicketTransferCancelledEvent({
        transferId: input.transferId,
      })
      await waitForPredicate(
        () =>
          db.query.ticketTransfers.findFirst({
            where: eq(ticketTransfers.id, input.transferId),
          }),
        (result) => !result,
      )
    } catch (error) {
      throw new Error("Ticket transfer cancellation failed")
    }
    return true
  })
