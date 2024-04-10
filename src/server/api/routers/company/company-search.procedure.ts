import { and, eq, ilike } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { companies } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const searchCompanyInput = z.object({
  name: z.string(),
})

export const searchCompanyProcedure = protectedProcedure
  .input(searchCompanyInput)
  .query(async ({ input }) => {
    return (
      (await db
        .select({
          id: companies.id,
          name: companies.name,
          description: companies.description,
        })
        .from(companies)
        .where(
          and(
            eq(companies.archived, false),
            ilike(companies.name, `%${input.name}%`),
          ),
        )
        .limit(50)
        .execute()) || []
    )
  })
