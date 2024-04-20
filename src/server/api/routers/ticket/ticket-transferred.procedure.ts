import { and, asc, eq, sql } from "drizzle-orm"

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
}

type TicketHistoryRow = {
  ticketId: string
  event: string | null
  transferTimestamp: number
  recipientEmail: string | null
  recipientFirstName: string | null
  recipientLastName: string | null
}[]

export const ticketsTransferredProcedure = protectedProcedure.query<
  TicketTransferHistory[]
>(async ({ ctx }): Promise<TicketTransferHistory[]> => {
  const userId = ctx.user.id

  // Using a CTE to find the earliest moment the user owned a ticket
  // The reason being is that want to show all the transfers that happened after the user owned the ticket
  // (Meaning you can't see transfers that happened before the user owned the ticket)
  const earliestMomentUserOwnedTicket = db.$with("earliestTimestamp").as(
    db
      .select({
        ticketId: ticketOwnershipHistory.ticketId,
        earliestTimestamp: sql`min(${ticketOwnershipHistory.timestamp})`.as(
          "earliestTimestamp",
        ),
      })
      .from(ticketOwnershipHistory)
      .where(eq(ticketOwnershipHistory.userId, userId))
      .groupBy(ticketOwnershipHistory.ticketId),
  )

  const result = await db
    .with(earliestMomentUserOwnedTicket)
    .select({
      ticketId: ticketOwnershipHistory.ticketId,
      event: events.name,
      transferTimestamp: ticketOwnershipHistory.timestamp,
      recipientEmail: profiles.emails,
      recipientFirstName: profiles.firstName,
      recipientLastName: profiles.lastName,
    })
    .from(ticketOwnershipHistory)
    .leftJoin(tickets, eq(tickets.id, ticketOwnershipHistory.ticketId))
    .leftJoin(events, eq(events.id, tickets.eventId))
    .leftJoin(profiles, eq(profiles.userId, ticketOwnershipHistory.userId))
    .leftJoin(
      earliestMomentUserOwnedTicket,
      eq(
        earliestMomentUserOwnedTicket.ticketId,
        ticketOwnershipHistory.ticketId,
      ),
    )
    .where(
      and(
        sql`${ticketOwnershipHistory.timestamp} >= ${earliestMomentUserOwnedTicket.earliestTimestamp}`,
      ),
    )
    .orderBy(asc(ticketOwnershipHistory.timestamp))

  const collection: Record<string, TicketTransferHistory> =
    groupRecipientsByTicketId(result)

  // todo: create a second CTE to filter out all tickets that have the current user id and a single ticket ownerhsip.
  return Object.values(collection).filter(
    (ticket) => ticket.recipients.length > 1,
  )
})

function groupRecipientsByTicketId(result: TicketHistoryRow) {
  const collection: Record<string, TicketTransferHistory> = {}
  for (const row of result) {
    if (!row.ticketId) {
      continue
    }

    if (collection[row.ticketId] === undefined) {
      collection[row.ticketId] = {
        id: row.ticketId,
        event: row.event ?? "",
        recipients: [],
      }
    }

    collection[row.ticketId]?.recipients.push({
      email: row.recipientEmail ?? "",
      firstName: row.recipientFirstName ?? "",
      lastName: row.recipientLastName ?? "",
      timestamp: row.transferTimestamp,
    })
  }
  return collection
}
