import { and, eq } from "drizzle-orm"

import { db } from "@/database"
import { companies } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const listCompanyProcedure = protectedProcedure.query(async () => {
  return (
    (await db
      .select({
        id: companies.id,
        name: companies.name,
        imageBase64: companies.imageBase64,
        description: companies.description,
        ownerId: companies.ownerId,
        companyType: companies.companyType,
        archived: companies.archived,
        reason: companies.reason,
      })
      .from(companies)
      .where(and(eq(companies.archived, false)))
      .execute()) || []
  )
})
