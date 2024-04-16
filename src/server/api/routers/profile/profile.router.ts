import { createTRPCRouter } from "@/server/api/trpc"

import { addProfileAdminProcedure } from "./profile-add-admin.procedure"
import { getProfileAdminsProcedure } from "./profile-admins.procedure"
import { getProfileProcedure } from "./profile-get.procedure"
import { getProfileByUserProcedure } from "./profile-get-by-user.procedure"
import { getMyProfileProcedure } from "./profile-me.procedure"
import { getProfilePaginatedProcedure } from "./profile-paginated.procedure"
import { removeProfileAdminProcedure } from "./profile-remove-admin.procedure"
import { searchProfileProcedure } from "./profile-search.procedure"
import { searchProfileEmailProcedure } from "./profile-search-email.procedure"
import { getProfileMeProcedure } from "./profile-total-count.procedure"
import { updateProfileProcedure } from "./profile-update.procedure"

export const profileRouter = createTRPCRouter({
  get: getProfileProcedure,
  getByUserId: getProfileByUserProcedure,
  me: getMyProfileProcedure,
  page: getProfilePaginatedProcedure,
  count: getProfileMeProcedure,
  update: updateProfileProcedure,
  search: searchProfileProcedure,
  searchEmail: searchProfileEmailProcedure,
  admins: getProfileAdminsProcedure,
  addAdmin: addProfileAdminProcedure,
  removeAdmin: removeProfileAdminProcedure,
})
