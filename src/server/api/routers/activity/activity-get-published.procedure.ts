import { and, eq, lt } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { activities } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetActivityInput = z.object({
  id: z.string(),
})

export const getActivityPublishedProcedure = protectedProcedure
  .input(GetActivityInput)
  .query(({ input }) => {
    return db.query.activities.findFirst({
      where: and(
        eq(activities.id, input.id),
        eq(activities.archived, false),
        lt(activities.publishedAt, new Date().toISOString()),
      ),
    })
  })
