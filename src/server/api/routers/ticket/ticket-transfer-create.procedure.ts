import { and, eq } from "drizzle-orm"
import shortUuid from "short-uuid"
import { z } from "zod"

import {
  sendTicketTransferCancelledEvent,
  sendTicketTransferCreatedEvent,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const CreateTicketTransferInput = z.object({
  ticketId: z.string(),
  userId: z.string().optional(),
})

export const createTicketTransferProcedure = protectedProcedure
  .input(CreateTicketTransferInput)
  .mutation(async ({ ctx, input }): Promise<string> => {
    const userId = input.userId ?? ctx.user.id
    const ticket = await db.query.tickets.findFirst({
      where: and(eq(tickets.id, input.ticketId), eq(tickets.userId, userId)),
    })
    if (!ticket) {
      throw new Error("Ticket not found")
    } else if (ticket.state !== "open") {
      throw new Error("Ticket not eligible for transfer")
    }

    const transfer = await db.query.ticketTransfers.findFirst({
      where: and(
        eq(ticketTransfers.ticketId, input.ticketId),
        eq(ticketTransfers.state, "open"),
      ),
    })
    if (transfer) {
      return transfer.id
    }

    const id: string = shortUuid.generate()
    await sendTicketTransferCreatedEvent({ id, state: "open", ...input })
    try {
      await waitForPredicate(
        () =>
          db.query.ticketTransfers.findFirst({
            where: eq(ticketTransfers.id, id),
          }),
        (result) => !!result,
      )
    } catch (error) {
      await sendTicketTransferCancelledEvent({
        transferId: id,
        _reason: "rollback",
      })
      throw new Error("Ticket transfer creation failed")
    }
    return id
  })
