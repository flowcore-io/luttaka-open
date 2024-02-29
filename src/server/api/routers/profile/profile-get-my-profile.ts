import { protectedProcedure } from "@/server/api/trpc"
import type { UserProfile } from "@/contracts/profile/user-profile"
import { getProfileByUserId } from "@/server/api/services/profile/get-profile-by-user-id"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"

export const getMyProfileRouter = protectedProcedure.query(
  async ({ ctx }): Promise<UserProfile> => {
    return getProfileByUserId(UserByIdInput.parse({ userId: ctx.user.id }))
  },
)
