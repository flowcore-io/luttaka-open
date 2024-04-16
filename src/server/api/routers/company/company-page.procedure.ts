import { and, eq, or } from "drizzle-orm"
import { z } from "zod"

import { CompanyType } from "@/contracts/company/company-type"
import { type PagedCompanyProfileResult } from "@/contracts/company/paged-companies"
import { PaginationInput } from "@/contracts/pagination/pagination"
import { db } from "@/database"
import { companies, profiles, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const CompanyPageInput = PaginationInput.extend({
  eventId: z.string(),
})

export const companyPageProcedure = protectedProcedure
  .input(CompanyPageInput)
  .query(async ({ input }): Promise<PagedCompanyProfileResult> => {
    const safePage = Math.max(1, input.page)

    const companiesAtEvent = await db
      .selectDistinct({ company: companies })
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
      .orderBy(companies.name)
      .limit(input.pageSize)
      .offset((safePage - 1) * input.pageSize)

    return {
      page: safePage,
      pageSize: companiesAtEvent.length,
      items: companiesAtEvent.map(({ company }) => {
        return {
          id: company.id,
          name: company.name,
          imageBase64: company.imageBase64 ?? "",
          description: company.description ?? "",
          companyType: company.companyType,
        }
      }),
    }
  })
