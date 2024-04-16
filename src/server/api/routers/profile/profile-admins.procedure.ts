import { and, eq } from "drizzle-orm"

import type { UserProfile } from "@/contracts/profile/user-profile"
import { db } from "@/database"
import { companies, profiles, users } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

export const getProfileAdminsProcedure = protectedProcedure.query(
  async (): Promise<UserProfile[]> => {
    const profileResult = await db
      .select()
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .leftJoin(companies, eq(companies.id, profiles.company))
      .where(
        and(
          eq(profiles.archived, false),
          eq(users.archived, false),
          eq(users.role, "admin"),
        ),
      )
      .execute()

    if (!profileResult.length) {
      return []
    }

    const result = profileResult.map((row): UserProfile => {
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
        emails: row.profiles.emails ?? "",
        company: row.companies?.name ?? "",
        companyId: row.profiles.company ?? "",
        avatarUrl: row.profiles.avatarUrl ?? "",
        initials,
      }
    })
    return result
  },
)
