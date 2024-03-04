import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { conferences } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetConferenceInput = z.object({
  id: z.string(),
})

export const getConferenceRouter = protectedProcedure
  .input(GetConferenceInput)
  .query(({ input }) => {
    return db.query.conferences.findFirst({
      where: eq(conferences.id, input.id),
    })
  })
