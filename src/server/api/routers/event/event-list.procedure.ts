import { eq } from "drizzle-orm"

import { db } from "@/database"
import { events } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getEventsProcedure = protectedProcedure.query(async () => {
  return (
    (await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        ticketDescription: events.ticketDescription,
        ticketPrice: events.ticketPrice,
        ticketCurrency: events.ticketCurrency,
        startDate: events.startDate,
        endDate: events.endDate,
        stripeId: events.stripeId,
      })
      .from(events)
      .where(eq(events.archived, false))
      .execute()) || []
  )
})
