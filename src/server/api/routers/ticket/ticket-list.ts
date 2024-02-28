import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

const GetTicketListInput = z.object({
  conferenceId: z.string(),
})

export const getTicketsRouter = protectedProcedure
  .input(GetTicketListInput)
  .query(({ ctx, input }) => {
    const userId = ctx.user.id
    return db
      .select({
        id: tickets.id,
        userId: tickets.userId,
        conferenceId: tickets.conferenceId,
        state: tickets.state,
        transferId: ticketTransfers.id,
      })
      .from(tickets)
      .leftJoin(
        ticketTransfers,
        and(
          eq(tickets.id, ticketTransfers.ticketId),
          eq(ticketTransfers.state, "open"),
        ),
      )
      .where(
        and(
          eq(tickets.userId, userId),
          eq(tickets.conferenceId, input.conferenceId),
        ),
      )
      .execute()
  })
