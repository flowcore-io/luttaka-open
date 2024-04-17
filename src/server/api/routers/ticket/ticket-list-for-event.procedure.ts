import { desc, eq } from "drizzle-orm"

import { TicketsForEventInputDto } from "@/contracts/ticket/ticket"
import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

export const listForEventProcedure = protectedProcedure
  .input(TicketsForEventInputDto)
  .use(adminsOnlyMiddleware)
  .query(({ input }) => {
    return db
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
      .leftJoin(ticketTransfers, eq(tickets.id, ticketTransfers.ticketId))
      .orderBy(
        desc(tickets.state),
        desc(ticketTransfers.id),
        desc(tickets.createdAt),
      )
      .where(eq(tickets.eventId, input.eventId))
      .execute()
  })
