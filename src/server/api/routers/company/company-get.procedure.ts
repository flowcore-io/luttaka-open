import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { companies } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const GetCompanyInput = z.object({
  companyId: z.string(),
})

export const getCompanyProcedure = protectedProcedure
  .input(GetCompanyInput)
  .query(async ({ ctx, input }) => {
    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, input.companyId),
        eq(companies.archived, false),
      ),
    })

    if (!company) {
      throw new Error("Company could not be found")
    }

    return {
      ...company,
      isOwner: ctx.user.id === company.ownerId,
    }
  })
