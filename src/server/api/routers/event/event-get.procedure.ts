import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { events } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetEventInput = z.object({
  id: z.string(),
})

export const getEventProcedure = protectedProcedure
  .input(GetEventInput)
  .query(({ input }) => {
    return db.query.events.findFirst({
      where: eq(events.id, input.id),
    })
  })
