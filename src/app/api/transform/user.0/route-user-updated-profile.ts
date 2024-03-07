import { and, eq, ne } from "drizzle-orm"

import { sendCompanyArchivedEvent } from "@/contracts/events/company"
import { UpdateUserProfileEventPayload } from "@/contracts/events/user"
import { db } from "@/database"
import { profiles } from "@/database/schemas"

export const routeUserUpdatedProfile = async (payload: unknown) => {
  const data = UpdateUserProfileEventPayload.parse(payload)

  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, data.userId),
  })

  if (!existingProfile) {
    console.error(
      `Unable to update profile for user ${data.userId}. Because profile was not found!`,
    )
    return
  }

  if (data.company !== undefined && data.company !== existingProfile.company) {
    const company = await db.query.profiles.findMany({
      where: and(
        eq(profiles.company, data.company),
        eq(profiles.archived, false),
        ne(profiles.id, data.userId),
      ),
    })

    if (company.length === 0) {
      await sendCompanyArchivedEvent({
        id: existingProfile.company!,
        _reason: "last user removed from company",
      })
    }
  }

  const profileResult = await db
    .update(profiles)
    .set({
      firstName: data.firstName ?? existingProfile.firstName,
      lastName: data.lastName ?? existingProfile.lastName,
      title: data.title ?? existingProfile.title,
      description: data.description ?? existingProfile.description,
      socials: data.socials ?? existingProfile.socials,
      company: data.company ?? existingProfile.company,
      avatarUrl: data.avatarUrl ?? existingProfile.avatarUrl,
    })
    .where(eq(profiles.id, existingProfile.id))

  if (profileResult.rowCount < 1) {
    console.error(`Unable to update profile for user ${data.userId}`)
    return
  }

  console.log(`Updated profile for user ${data.userId}`)
}
