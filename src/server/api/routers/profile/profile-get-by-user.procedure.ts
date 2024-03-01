import { ProfileByUserIdInput } from "@/contracts/profile/profile-by-user-id-input"
import type { UserProfile } from "@/contracts/profile/user-profile"
import { getProfileAndCompany } from "@/server/api/services/profile/get-profile-and-company"
import { protectedProcedure } from "@/server/api/trpc"

export const getProfileByUserProcedure = protectedProcedure
  .input(ProfileByUserIdInput)
  .query(async ({ input }): Promise<UserProfile> => {
    return getProfileAndCompany(input)
  })
