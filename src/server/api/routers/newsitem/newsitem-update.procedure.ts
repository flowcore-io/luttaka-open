import { and, eq, type SQL } from "drizzle-orm"

import { sendNewsitemUpdatedEvent } from "@/contracts/events/newsitem"
import { UpdateNewsitemInputDto } from "@/contracts/newsitem/newsitem"
import { db } from "@/database"
import { newsitems } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const updateNewsitemProcedure = protectedProcedure
  .input(UpdateNewsitemInputDto)
  .mutation(async ({ input }) => {
    if (
      !(await db.query.newsitems.findFirst({
        where: and(eq(newsitems.id, input.id), eq(newsitems.archived, false)),
      }))
    ) {
      throw new Error("Newsitem not found")
    }

    await sendNewsitemUpdatedEvent({ ...input })
    try {
      const condition: SQL<unknown>[] = [
        eq(newsitems.id, input.id),
        ...(input.title ? [eq(newsitems.title, input.title)] : []),
        ...(input.introText ? [eq(newsitems.introText, input.introText)] : []),
        ...(input.fullText ? [eq(newsitems.fullText, input.fullText)] : []),
        ...(input.publicVisibility
          ? [eq(newsitems.publicVisibility, input.publicVisibility)]
          : []),
        ...(input.publishedAt
          ? [eq(newsitems.publishedAt, input.publishedAt)]
          : []),
        eq(newsitems.archived, false),
        ...(input.reason ? [eq(newsitems.reason, input.reason)] : []),
      ]

      await waitForPredicate(
        () =>
          db.query.newsitems.findFirst({
            where: and(...condition),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
