import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetTicketByIdInput = z.object({
  id: z.string(),
})

export const getTicketProcedure = protectedProcedure
  .input(GetTicketByIdInput)
  .query(async ({ input }) => {
    const results = await db
      .select({
        id: tickets.id,
        userId: tickets.userId,
        eventId: tickets.eventId,
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
      .where(eq(tickets.id, input.id))
      .limit(1)
      .execute()
    return results[0]
  })
