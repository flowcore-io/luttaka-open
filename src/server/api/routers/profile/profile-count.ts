import { protectedProcedure } from "@/server/api/trpc"
import { getTotalNumberOfProfiles } from "@/server/api/services/profile/page-profiles"

export const profileCountRouter = protectedProcedure.query(
  async (): Promise<number> => {
    return getTotalNumberOfProfiles()
  },
)
