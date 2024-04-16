import { and, eq, ilike } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { profiles } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const searchProfileEmailInput = z.object({
  emails: z.string(),
})

export const searchProfileEmailProcedure = protectedProcedure
  .input(searchProfileEmailInput)
  .query(async ({ input }) => {
    return (
      (await db
        .select({
          userId: profiles.userId,
          emails: profiles.emails,
        })
        .from(profiles)
        .where(
          and(
            eq(profiles.archived, false),
            ilike(profiles.emails, `%${input.emails}%`),
          ),
        )
        .limit(50)
        .execute()) || []
    )
  })
