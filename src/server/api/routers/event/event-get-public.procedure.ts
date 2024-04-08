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
  .query(({ input }) => {
    return db.query.events.findFirst({
      where: eq(events.slug, input.slug),
    })
  })
