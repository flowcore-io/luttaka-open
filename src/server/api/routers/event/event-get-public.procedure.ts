import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { events } from "@/database/schemas"
import { publicProcedure } from "@/server/api/trpc"

const GetEventInput = z.object({
  slug: z.string(),
})

export const getEventPublicProcedure = publicProcedure
  .input(GetEventInput)
  .query(async ({ input }) => {
    const event = await db.query.events.findFirst({
      where: eq(events.slug, input.slug),
    })

    if (!event) {
      return { noResults: true }
    }

    return event
  })
