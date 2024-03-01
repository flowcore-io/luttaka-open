import type { UserProfile } from "@/contracts/profile/user-profile"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"
import { getProfileAndCompany } from "@/server/api/services/profile/get-profile-and-company"
import { protectedProcedure } from "@/server/api/trpc"

export const getMyProfileProcedure = protectedProcedure.query(
  async ({ ctx }): Promise<UserProfile> => {
    return getProfileAndCompany(UserByIdInput.parse({ userId: ctx.user.id }))
  },
)
