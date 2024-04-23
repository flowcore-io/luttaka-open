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
        slug: events.slug ?? "",
        imageBase64: events.imageBase64 ?? "",
        description: events.description ?? "",
        ticketDescription: events.ticketDescription ?? "",
        ticketPrice: events.ticketPrice,
        ticketCurrency: events.ticketCurrency,
        startDate: events.startDate,
        endDate: events.endDate,
        productId: events.productId,
      })
      .from(events)
      .where(eq(events.archived, false))
      .execute()) || []
  )
})
