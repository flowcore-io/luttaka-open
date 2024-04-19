import { and, asc, eq, gte } from "drizzle-orm"

import { db } from "@/database"
import {
  events,
  profiles,
  ticketOwnershipHistory,
  tickets,
} from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

type TicketTransferHistoryRecipient = {
  email: string
  firstName: string
  lastName: string
  timestamp: number
}

export type TicketTransferHistory = {
  id: string
  event: string
  recipients: TicketTransferHistoryRecipient[]
  ticketNote: string
}

export const ticketsTransferredProcedure = protectedProcedure.query<
  TicketTransferHistory[]
>(async ({ ctx }): Promise<TicketTransferHistory[]> => {
  const userId = ctx.user.id

  // todo: this entire thing should be a single query
  const originPoints = await db
    .select({
      timestamp: ticketOwnershipHistory.timestamp,
      ticketId: ticketOwnershipHistory.ticketId,
      events: events.name,
    })
    .from(ticketOwnershipHistory)
    .where(eq(ticketOwnershipHistory.userId, userId))
    .leftJoin(tickets, eq(tickets.id, ticketOwnershipHistory.ticketId))
    .leftJoin(events, eq(events.id, tickets.eventId))
    .execute()

  const result = await Promise.all(
    originPoints.map(async (originPoint): Promise<TicketTransferHistory> => {
      const ticketChanges = await db
        .select({
          timestamp: ticketOwnershipHistory.timestamp,
          ticketId: ticketOwnershipHistory.ticketId,
          userId: ticketOwnershipHistory.userId,
          recipientEmail: profiles.emails,
          recipientName: profiles.firstName,
          recipientLastName: profiles.lastName,
        })
        .from(ticketOwnershipHistory)
        .where(
          and(
            eq(ticketOwnershipHistory.ticketId, originPoint.ticketId),
            gte(ticketOwnershipHistory.timestamp, originPoint.timestamp),
          ),
        )
        .leftJoin(profiles, eq(profiles.userId, ticketOwnershipHistory.userId))
        .orderBy(asc(ticketOwnershipHistory.timestamp))
        .execute()

      return {
        id: originPoint.ticketId,
        event: originPoint.events ?? "",
        recipients: ticketChanges.map(
          (ticketChange): TicketTransferHistoryRecipient => ({
            email: ticketChange.recipientEmail ?? "",
            firstName: ticketChange.recipientName ?? "",
            lastName: ticketChange.recipientLastName ?? "",
            timestamp: ticketChange.timestamp,
          }),
        ),
        ticketNote: "",
      }
    }),
  )

  return result
})
