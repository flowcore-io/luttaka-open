import { createCompanyRouter } from "@/server/api/routers/company/company-create"
import { getCompanyRouter } from "@/server/api/routers/company/company-list"
import { archiveConferenceRouter } from "@/server/api/routers/conference/conference-archive"
import { createConferenceRouter } from "@/server/api/routers/conference/conference-create"
import { updateConferenceRouter } from "@/server/api/routers/conference/conference-update"
import { createTRPCRouter } from "@/server/api/trpc"

export const companyRouter = createTRPCRouter({
  list: getCompanyRouter,
  create: createCompanyRouter,
  update: updateConferenceRouter,
  archive: archiveConferenceRouter,
})
