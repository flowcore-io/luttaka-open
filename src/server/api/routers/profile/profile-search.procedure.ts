import { and, eq, ilike } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { profiles } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const searchProfileInput = z.object({
  firstName: z.string(),
})

export const searchProfileProcedure = protectedProcedure
  .input(searchProfileInput)
  .query(async ({ input }) => {
    return (
      (await db
        .select({
          id: profiles.id,
          firstName: profiles.firstName,
        })
        .from(profiles)
        .where(
          and(
            eq(profiles.archived, false),
            ilike(profiles.firstName, `%${input.firstName}%`),
          ),
        )
        .limit(50)
        .execute()) || []
    )
  })
