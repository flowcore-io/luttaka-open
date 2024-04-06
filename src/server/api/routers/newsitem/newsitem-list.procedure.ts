import { eq } from "drizzle-orm"

import { db } from "@/database"
import { newsitems } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getNewsitemsProcedure = protectedProcedure.query(async () => {
  return (
    (await db
      .select({
        id: newsitems.id,
        title: newsitems.title,
        introText: newsitems.introText,
        fullText: newsitems.fullText,
        publicVisibility: newsitems.publicVisibility,
        publishedAt: newsitems.publishedAt,
        archived: newsitems.archived,
        reason: newsitems.reason,
      })
      .from(newsitems)
      .where(eq(newsitems.archived, false))
      .execute()) || []
  )
})
