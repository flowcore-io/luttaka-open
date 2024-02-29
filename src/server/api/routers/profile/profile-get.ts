import { protectedProcedure } from "@/server/api/trpc"
import { ProfileByIdInput } from "@/contracts/profile/profile-by-id-input"
import type { UserProfile } from "@/contracts/profile/user-profile"
import { db } from "@/database"
import { eq } from "drizzle-orm"
import { profiles } from "@/database/schemas"
import { getInitialsFromString } from "@/server/lib/format/get-initials-from-string"

export const getProfileRouter = protectedProcedure
  .input(ProfileByIdInput)
  .query(async ({ input }): Promise<UserProfile> => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, input.profileId),
    })

    if (!profile) {
      throw new Error(`Profile not found`)
    }

    const displayName = `${profile.firstName} ${profile.lastName}`
    const initials = getInitialsFromString(displayName)
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      displayName: `${profile.firstName} ${profile.lastName}`,
      description: profile.description ?? "",
      title: profile.title ?? "",
      socials: profile.socials ?? "",
      company: profile.company ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      initials,
    }
  })
