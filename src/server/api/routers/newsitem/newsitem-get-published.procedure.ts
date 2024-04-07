import { and, eq, lt } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { newsitems } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetNewsitemInput = z.object({
  id: z.string(),
})

export const getNewsitemPublishedProcedure = protectedProcedure
  .input(GetNewsitemInput)
  .query(({ input }) => {
    return db.query.newsitems.findFirst({
      where: and(
        eq(newsitems.id, input.id),
        eq(newsitems.archived, false),
        lt(newsitems.publishedAt, new Date().toISOString()),
      ),
    })
  })
