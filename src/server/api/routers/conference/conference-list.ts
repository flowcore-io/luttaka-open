import { eq } from "drizzle-orm"

import { db } from "@/database"
import { conferences } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getConferencesRouter = protectedProcedure.query(async () => {
  return (
    (await db
      .select({
        id: conferences.id,
        name: conferences.name,
        description: conferences.description,
        ticketDescription: conferences.ticketDescription,
        ticketPrice: conferences.ticketPrice,
        ticketCurrency: conferences.ticketCurrency,
        startDate: conferences.startDate,
        endDate: conferences.endDate,
        stripeId: conferences.stripeId,
      })
      .from(conferences)
      .where(eq(conferences.archived, false))
      .execute()) || []
  )
})
