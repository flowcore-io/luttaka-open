import { eq } from "drizzle-orm"

import { type UserProfile } from "@/contracts/profile/user-profile"
import { db } from "@/database"
import { companies, profiles } from "@/database/schemas"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

export const getProfileAndCompany = async ({
  userId,
  profileId,
}: {
  userId?: string
  profileId?: string
}): Promise<UserProfile> => {
  if (!userId && !profileId) {
    throw new Error("userId or profileId is required")
  }

  const result = await db
    .select()
    .from(profiles)
    .where(
      profileId ? eq(profiles.id, profileId) : eq(profiles.userId, userId!),
    )
    .leftJoin(companies, eq(profiles.company, companies.id))
    .execute()

  if (result.length === 0) {
    throw new Error(`Profile not found`)
  }

  const profileData = result[0]!

  const displayName = `${profileData.profiles.firstName} ${profileData.profiles.lastName}`
  const initials = getInitialsFromString(displayName)
  return {
    id: profileData.profiles.id,
    userId: profileData.profiles.userId,
    firstName: profileData.profiles.firstName ?? "",
    lastName: profileData.profiles.lastName ?? "",
    displayName: `${profileData.profiles.firstName} ${profileData.profiles.lastName}`,
    description: profileData.profiles.description ?? "",
    title: profileData.profiles.title ?? "",
    socials: profileData.profiles.socials ?? "",
    emails: profileData.profiles.emails ?? "",
    company: profileData.companies?.name ?? "",
    companyId: profileData.profiles.company ?? "",
    avatarUrl: profileData.profiles.avatarUrl ?? "",
    initials,
  }
}
