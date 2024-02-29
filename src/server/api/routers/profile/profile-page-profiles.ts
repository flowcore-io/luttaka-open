import { PaginationInput } from "@/contracts/pagination/pagination"
import type { PagedProfileResult } from "@/contracts/profile/paged-profiles"
import type { UserProfile } from "@/contracts/profile/user-profile"
import { db } from "@/database"
import { protectedProcedure } from "@/server/api/trpc"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

export const pageProfilesRouter = protectedProcedure
  .input(PaginationInput)
  .query(async ({ input }): Promise<PagedProfileResult> => {
    const safePage = Math.max(input.page - 1, 0)

    const profiles = await db.query.profiles.findMany({
      offset: safePage * input.pageSize,
      limit: input.pageSize,
      orderBy: (profile, { asc }) => [asc(profile.firstName)],
    })

    if (!profiles.length) {
      return {
        items: [],
        page: 0,
        pageSize: 0,
      }
    }

    return {
      page: input.page,
      pageSize: profiles.length,
      items: profiles.map((profile): UserProfile => {
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
