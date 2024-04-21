import { and, desc, eq, isNull } from "drizzle-orm"

import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

// todo: convert to a global contract
export type TicketDetails = {
  id: string
  userId: string
  eventId: string
  state: string
  transferId: string | null
  ticketNote: string | null
  transferNote: string | null
}

export const getTicketsProcedure = protectedProcedure.query<TicketDetails[]>(
  async ({ ctx }): Promise<TicketDetails[]> => {
    const userId = ctx.user.id

    const result = await db
      .select({
        id: tickets.id,
        userId: tickets.userId,
        eventId: tickets.eventId,
        state: tickets.state,
        transferId: ticketTransfers.id,
        ticketNote: tickets.note,
        transferNote: ticketTransfers.note,
      })
      .from(tickets)
      .leftJoin(
        ticketTransfers,
        and(
          eq(tickets.id, ticketTransfers.ticketId),
          eq(ticketTransfers.state, "open"),
        ),
      )
      .orderBy(
        desc(tickets.state),
        desc(ticketTransfers.id),
        desc(tickets.createdAt),
      )
      .where(and(eq(tickets.userId, userId), isNull(ticketTransfers.id)))
      .execute()

    return result.map(
      (row): TicketDetails => ({
        id: row.id,
        userId: row.userId,
        eventId: row.eventId,
        state: row.state,
        transferId: row.transferId,
        ticketNote: row.ticketNote,
        transferNote: row.transferNote,
      }),
    )
  },
)
