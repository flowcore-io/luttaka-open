import { createCompanyRouter } from "@/server/api/routers/company/company-create"
import { getCompanyRouter } from "@/server/api/routers/company/company-get"
import { listCompanyRouter } from "@/server/api/routers/company/company-list"
import { updateCompanyRouter } from "@/server/api/routers/company/company-update"
import { archiveConferenceRouter } from "@/server/api/routers/conference/conference-archive"
import { createTRPCRouter } from "@/server/api/trpc"

export const companyRouter = createTRPCRouter({
  list: listCompanyRouter,
  get: getCompanyRouter,
  create: createCompanyRouter,
  update: updateCompanyRouter,
  archive: archiveConferenceRouter,
})
