import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getTicketsRouter = protectedProcedure.query(({ ctx }) => {
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
    .where(eq(tickets.userId, userId))
    .execute()
})
