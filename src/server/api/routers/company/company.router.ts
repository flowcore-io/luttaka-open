import { createCompanyProcedure } from "@/server/api/routers/company/company-create.procedure"
import { getCompanyProcedure } from "@/server/api/routers/company/company-get.procedure"
import { listCompanyProcedure } from "@/server/api/routers/company/company-list.procedure"
import { updateCompanyProcedure } from "@/server/api/routers/company/company-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const companyRouter = createTRPCRouter({
  list: listCompanyProcedure,
  get: getCompanyProcedure,
  create: createCompanyProcedure,
  update: updateCompanyProcedure,
})
