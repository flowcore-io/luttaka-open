import { createTRPCRouter } from "@/server/api/trpc"
import { getProfileRouter } from "@/server/api/routers/profile/profile-get"
import { getProfileByUserIdRouter } from "@/server/api/routers/profile/profile-get-by-user-id"
import { getMyProfileRouter } from "@/server/api/routers/profile/profile-get-my-profile"
import { pageProfilesRouter } from "@/server/api/routers/profile/profile-page-profiles"
import { profileCountRouter } from "@/server/api/routers/profile/profile-count"
import { profileUpdateRouter } from "@/server/api/routers/profile/profile-update"

export const profileRouter = createTRPCRouter({
  // todo: merge the two
  get: getProfileRouter,
  getByUserId: getProfileByUserIdRouter,

  me: getMyProfileRouter,
  page: pageProfilesRouter,
  count: profileCountRouter,
  update: profileUpdateRouter,
})
