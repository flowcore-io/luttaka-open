import { eq } from "drizzle-orm"
import { type z } from "zod"

import {
  type UpdateUserProfileEventPayload,
  userEvent,
} from "@/contracts/events/user"
import { UpdateUserProfileInput } from "@/contracts/profile/update-profile-input"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"
import { db } from "@/database"
import { profiles } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { sendWebhook } from "@/lib/webhook"
import { getProfileAndCompany } from "@/server/api/services/profile/get-profile-and-company"
import { protectedProcedure } from "@/server/api/trpc"

export const updateProfileProcedure = protectedProcedure
  .input(UpdateUserProfileInput)
  .mutation(async ({ input, ctx }): Promise<string> => {
    const userId = ctx.user?.id
    const profile = await getProfileAndCompany(UserByIdInput.parse({ userId }))
    const profileId = profile.id

    await sendWebhook<z.infer<typeof UpdateUserProfileEventPayload>>(
      userEvent.flowType,
      userEvent.eventType.updatedProfile,
      {
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
        title: input.title,
        description: input.description,
        socials: input.socials,
        company: input.company,
        avatarUrl: input.avatarUrl,
      },
    )

    await waitForPredicate(
      () => db.query.profiles.findFirst({ where: eq(profiles.id, profileId) }),
      (profile) => {
        if (!profile) {
          return false
        }

        return (
          profile.firstName === input.firstName &&
          profile.lastName === input.lastName &&
          profile.title === input.title &&
          profile.description === input.description &&
          profile.socials === input.socials &&
          profile.company === input.company &&
          profile.avatarUrl === input.avatarUrl
        )
      },
    )

    return profile.id
  })
