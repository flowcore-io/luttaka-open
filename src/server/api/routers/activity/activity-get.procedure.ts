import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { activities } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetActivityInput = z.object({
  id: z.string(),
})

export const getActivityProcedure = protectedProcedure
  .input(GetActivityInput)
  .query(({ input }) => {
    return db.query.activities.findFirst({
      where: eq(activities.id, input.id),
    })
  })
