import { protectedProcedure } from "@/server/api/trpc"
import { UpdateUserProfileInput } from "@/contracts/profile/update-profile-input"
import { getProfileByUserId } from "@/server/api/services/profile/get-profile-by-user-id"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"
import { sendWebhook } from "@/lib/webhook"
import type { z } from "zod"
import {
  UpdateUserProfileEventPayload,
  userEvent,
} from "@/contracts/events/user"
import { waitFor } from "@/server/lib/delay/wait-for"
import { db } from "@/database"
import { eq } from "drizzle-orm"
import { profiles } from "@/database/schemas"

export const profileUpdateRouter = protectedProcedure
  .input(UpdateUserProfileInput)
  .mutation(async ({ input, ctx }): Promise<string> => {
    const userId = ctx.user?.id
    const profile = await getProfileByUserId(UserByIdInput.parse({ userId }))
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

    const result = await waitFor(
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

    if (!result) {
      throw new Error(`Profile not found`)
    }

    return result.id
  })
