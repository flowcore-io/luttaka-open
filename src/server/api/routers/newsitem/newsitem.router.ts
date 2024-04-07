import { archiveNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-archive.procedure"
import { createNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-create.procedure"
import { getNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-get.procedure"
import { getNewsitemsProcedure } from "@/server/api/routers/newsitem/newsitem-list.procedure"
import { getNewsitemsPublishedProcedure } from "@/server/api/routers/newsitem/newsitem-list-published.procedure"
import { updateNewsitemProcedure } from "@/server/api/routers/newsitem/newsitem-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

import { getNewsitemPublishedProcedure } from "./newsitem-get-published.procedure"

export const newsitemRouter = createTRPCRouter({
  get: getNewsitemProcedure,
  getPublished: getNewsitemPublishedProcedure,
  list: getNewsitemsProcedure,
  listPublished: getNewsitemsPublishedProcedure,
  create: createNewsitemProcedure,
  update: updateNewsitemProcedure,
  archive: archiveNewsitemProcedure,
})
