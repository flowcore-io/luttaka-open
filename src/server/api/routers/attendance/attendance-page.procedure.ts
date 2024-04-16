import { eq } from "drizzle-orm"
import { z } from "zod"

import { PaginationInput } from "@/contracts/pagination/pagination"
import { type PagedProfileResult } from "@/contracts/profile/paged-profiles"
import { db } from "@/database"
import { companies, profiles, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

const AttendancePageInput = PaginationInput.extend({
  eventId: z.string(),
})

export const attendancePageProcedure = protectedProcedure
  .input(AttendancePageInput)
  .query(async ({ input }): Promise<PagedProfileResult> => {
    const safePage = Math.max(1, input.page)

    const profilesWithTicketsForEvent = await db
      .selectDistinct({ profile: profiles, companyName: companies.name })
      .from(profiles)
      // obtain associated ticket
      .leftJoin(tickets, eq(profiles.userId, tickets.userId))
      .where(eq(tickets.eventId, input.eventId))
      // obtain associated company
      .leftJoin(companies, eq(profiles.company, companies.id))
      // page the joined information
      .orderBy(profiles.firstName)
      .limit(input.pageSize)
      .offset((safePage - 1) * input.pageSize)

    return {
      page: safePage,
      pageSize: profilesWithTicketsForEvent.length,
      items: profilesWithTicketsForEvent.map(({ profile, companyName }) => {
        const displayName = `${profile.firstName} ${profile.lastName}`
        const initials = getInitialsFromString(displayName)
        return {
          id: profile.id,
          userId: profile.userId,
          displayName: displayName,
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          title: profile.title ?? "",
          description: profile.description ?? "",
          socials: profile.socials ?? "",
          emails: profile.emails ?? "",
          company: companyName ?? "Individual",
          companyId: profile.company ?? "",
          avatarUrl: profile.avatarUrl ?? "",
          initials,
        }
      }),
    }
  })
