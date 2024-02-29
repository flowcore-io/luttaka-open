import { eq } from "drizzle-orm"
import { z } from "zod"

import { PaginationInput } from "@/contracts/pagination/pagination"
import { type PagedProfileResult } from "@/contracts/profile/paged-profiles"
import { db } from "@/database"
import { profiles, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

const AttendancePageInput = PaginationInput.extend({
  conferenceId: z.string(),
})

export const attendancePageProcedure = protectedProcedure
  .input(AttendancePageInput)
  .query(async ({ input }): Promise<PagedProfileResult> => {
    const safePage = Math.max(1, input.page)

    const profilesWithTicketsForConference = await db
      .selectDistinct({ profile: profiles })
      .from(profiles)
      .leftJoin(tickets, eq(profiles.userId, tickets.userId))
      .where(eq(tickets.conferenceId, input.conferenceId))
      .orderBy(profiles.firstName)
      .limit(input.pageSize)
      .offset((safePage - 1) * input.pageSize)

    return {
      page: safePage,
      pageSize: profilesWithTicketsForConference.length,
      items: profilesWithTicketsForConference.map(({ profile }) => {
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
          company: profile.company ?? "",
          avatarUrl: profile.avatarUrl ?? "",
          initials,
        }
      }),
    }
  })
