import { and, count, eq, or } from "drizzle-orm"
import { z } from "zod"

import { CompanyType } from "@/contracts/company/company-type"
import { db } from "@/database"
import { companies, profiles, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const companyVisibleCountProcedure = protectedProcedure
  .input(
    z.object({
      eventId: z.string(),
    }),
  )
  .query(async ({ input }): Promise<number> => {
    return db
      .select({ value: count() })
      .from(companies)
      .leftJoin(profiles, eq(companies.id, profiles.company))
      .leftJoin(tickets, eq(profiles.userId, tickets.userId))
      .where(
        and(
          eq(companies.archived, false),
          or(
            eq(companies.companyType, CompanyType.exhibitor),
            eq(companies.companyType, CompanyType.sponsor),
            and(
              eq(companies.companyType, CompanyType.default),
              eq(tickets.eventId, input.eventId),
              eq(tickets.state, "open"),
            ),
          ),
        ),
      )
      .then((result) => result[0]?.value ?? 0)
  })
