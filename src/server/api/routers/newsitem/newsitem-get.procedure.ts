import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { newsitems } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const GetNewsitemInput = z.object({
  id: z.string(),
})

export const getNewsitemProcedure = protectedProcedure
  .input(GetNewsitemInput)
  .query(({ input }) => {
    return db.query.newsitems.findFirst({
      where: eq(newsitems.id, input.id),
    })
  })
