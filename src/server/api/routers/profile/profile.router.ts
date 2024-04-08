import { getProfileProcedure } from "@/server/api/routers/profile/profile-get.procedure"
import { getProfileByUserProcedure } from "@/server/api/routers/profile/profile-get-by-user.procedure"
import { getMyProfileProcedure } from "@/server/api/routers/profile/profile-me.procedure"
import { getProfilePaginatedProcedure } from "@/server/api/routers/profile/profile-paginated.procedure"
import { searchProfileProcedure } from "@/server/api/routers/profile/profile-search.procedure"
import { getProfileMeProcedure } from "@/server/api/routers/profile/profile-total-count.procedure"
import { updateProfileProcedure } from "@/server/api/routers/profile/profile-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const profileRouter = createTRPCRouter({
  get: getProfileProcedure,
  getByUserId: getProfileByUserProcedure,
  me: getMyProfileProcedure,
  page: getProfilePaginatedProcedure,
  count: getProfileMeProcedure,
  update: updateProfileProcedure,
  search: searchProfileProcedure,
})
