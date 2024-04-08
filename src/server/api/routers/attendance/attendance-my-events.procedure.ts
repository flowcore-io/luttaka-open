import { desc, eq } from "drizzle-orm"

import { type EventProfile } from "@/contracts/event/event"
import { db } from "@/database"
import { events, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const attendanceMyEventsProcedure = protectedProcedure.query(
  async ({ ctx }): Promise<EventProfile[]> => {
    const userId = ctx.user.id

    const eventsUserIsAttending = await db
      .selectDistinct({ event: events })
      .from(events)
      .leftJoin(tickets, eq(events.id, tickets.eventId))
      .where(eq(tickets.userId, userId))
      .orderBy(desc(events.startDate))

    return eventsUserIsAttending.map(({ event }) => ({
      id: event.id,
      name: event.name,
      slug: event.slug ?? "",
      description: event.description ?? "",
      ticketDescription: event.ticketDescription ?? "",
      ticketPrice: event.ticketPrice,
      ticketCurrency: event.ticketCurrency,
      startDate: event.startDate,
      endDate: event.endDate,
      stripeId: event.stripeId,
    }))
  },
)
