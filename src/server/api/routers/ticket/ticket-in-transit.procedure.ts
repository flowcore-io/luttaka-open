import { and, desc, eq, isNotNull } from "drizzle-orm"

import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

import { type TicketDetails } from "./ticket-list.procedure"

export const ticketsInTransit = protectedProcedure.query<TicketDetails[]>(
  async ({ ctx }): Promise<TicketDetails[]> => {
    const userId = ctx.user.id

    // todo: consider converting the in-transit tickets and the non-in-transit tickets into a single query, with a filter
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
      .where(and(eq(tickets.userId, userId), isNotNull(ticketTransfers.id)))
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
