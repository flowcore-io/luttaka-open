import { and, eq, type SQL } from "drizzle-orm"

import { UpdateCompanyInputDto } from "@/contracts/company/company"
import { sendCompanyUpdatedEvent } from "@/contracts/events/company"
import { db } from "@/database"
import { companies } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const updateCompanyRouter = protectedProcedure
  .input(UpdateCompanyInputDto)
  .mutation(async ({ input }) => {
    if (
      !(await db.query.companies.findFirst({
        where: and(eq(companies.id, input.id), eq(companies.archived, false)),
      }))
    ) {
      throw new Error("Company not found")
    }

    await sendCompanyUpdatedEvent({ ...input })
    try {
      const condition: SQL<unknown>[] = [
        eq(companies.id, input.id),
        eq(companies.archived, false),
        ...(input.name ? [eq(companies.name, input.name)] : []),
        ...(input.description
          ? [eq(companies.description, input.description)]
          : []),
      ]

      await waitForPredicate(
        () =>
          db.query.companies.findFirst({
            where: and(...condition),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
