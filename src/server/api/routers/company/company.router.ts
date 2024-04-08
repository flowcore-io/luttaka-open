import { createCompanyProcedure } from "@/server/api/routers/company/company-create.procedure"
import { getCompanyProcedure } from "@/server/api/routers/company/company-get.procedure"
import { searchCompanyProcedure } from "@/server/api/routers/company/company-search.procedure"
import { updateCompanyProcedure } from "@/server/api/routers/company/company-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

import { archiveCompanyProcedure } from "./company-archive.procedure"
import { listCompanyProcedure } from "./company-list.procedure"
import { companyPageProcedure } from "./company-page.procedure"
import { companyVisibleCountProcedure } from "./company-visible-count.procedure"

export const companyRouter = createTRPCRouter({
  search: searchCompanyProcedure,
  get: getCompanyProcedure,
  list: listCompanyProcedure,
  page: companyPageProcedure,
  count: companyVisibleCountProcedure,
  create: createCompanyProcedure,
  update: updateCompanyProcedure,
  archive: archiveCompanyProcedure,
})
