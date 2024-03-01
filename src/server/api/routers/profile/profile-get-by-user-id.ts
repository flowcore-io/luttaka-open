import { ProfileByUserIdInput } from "@/contracts/profile/profile-by-user-id-input"
import type { UserProfile } from "@/contracts/profile/user-profile"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"
import { getProfileByUserId } from "@/server/api/services/profile/get-profile-by-user-id"
import { protectedProcedure } from "@/server/api/trpc"

export const getProfileByUserIdRouter = protectedProcedure
  .input(ProfileByUserIdInput)
  .query(async ({ input }): Promise<UserProfile> => {
    return getProfileByUserId(UserByIdInput.parse({ userId: input.userId }))
  })
