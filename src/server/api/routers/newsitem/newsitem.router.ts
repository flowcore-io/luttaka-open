import { archiveNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-archive.procedure"
import { createNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-create.procedure"
import { getNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-get.procedure"
import { getNewsitemsProcedure } from "@/server/api/routers/newsitem/newsitem-list.procedure"
import { updateNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const newsitemRouter = createTRPCRouter({
  get: getNewsitemProcedure,
  list: getNewsitemsProcedure,
  create: createNewsitemProcedure,
  update: updateNewsitemProcedure,
  archive: archiveNewsitemProcedure,
})
