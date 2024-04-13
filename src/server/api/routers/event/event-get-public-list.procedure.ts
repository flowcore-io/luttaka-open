import { eq } from "drizzle-orm"

import { db } from "@/database"
import { events } from "@/database/schemas"
import { publicProcedure } from "@/server/api/trpc"

export const getEventPublicListProcedure = publicProcedure.query(async () => {
  return (
    (await db
      .select({
        id: events.id,
        name: events.name,
        slug: events.slug ?? "",
        imageBase64: events.imageBase64 ?? "",
        description: events.description ?? "",
        ticketDescription: events.ticketDescription ?? "",
        startDate: events.startDate,
        endDate: events.endDate,
      })
      .from(events)
      .where(eq(events.archived, false))
      .execute()) || []
  )
})
