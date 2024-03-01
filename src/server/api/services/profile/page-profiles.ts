import { asc, count, eq } from "drizzle-orm"
import { type z } from "zod"

import { type PaginationInput } from "@/contracts/pagination/pagination"
import { type PagedProfileResult } from "@/contracts/profile/paged-profiles"
import { type UserProfile } from "@/contracts/profile/user-profile"
import { db } from "@/database"
import { companies, profiles } from "@/database/schemas"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

export const pageProfiles = async (
  input: z.infer<typeof PaginationInput>,
): Promise<PagedProfileResult> => {
  const safePage = Math.max(input.page - 1, 0)

  const profileResult = await db
    .select()
    .from(profiles)
    .leftJoin(companies, eq(profiles.company, companies.id))
    .limit(input.pageSize)
    .offset(safePage * input.pageSize)
    .orderBy(asc(profiles.firstName))
    .execute()

  if (!profileResult.length) {
    return {
      items: [],
      page: 0,
      pageSize: 0,
    }
  }

  return {
    page: input.page,
    pageSize: profileResult.length,
    items: profileResult.map((row): UserProfile => {
      const displayName = `${row.profiles.firstName} ${row.profiles.lastName}`
      const initials = getInitialsFromString(displayName)
      return {
        id: row.profiles.id,
        userId: row.profiles.userId,
        displayName: displayName,
        firstName: row.profiles.firstName ?? "",
        lastName: row.profiles.lastName ?? "",
        title: row.profiles.title ?? "",
        description: row.profiles.description ?? "",
        socials: row.profiles.socials ?? "",
        company: row.companies?.name ?? "",
        companyId: row.profiles.company ?? "",
        avatarUrl: row.profiles.avatarUrl ?? "",
        initials,
      }
    }),
  }
}

// todo: convert this to only fetch the number of profiles associated a relevant conference
export const getTotalNumberOfProfiles = async (): Promise<number> => {
  return db
    .select({ value: count() })
    .from(profiles)
    .then((result) => result[0]?.value ?? 0)
}
