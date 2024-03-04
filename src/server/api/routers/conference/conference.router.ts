import { archiveConferenceProcedure } from "@/server/api/routers/conference/conference-archive.procedure"
import { createConferenceProcedure } from "@/server/api/routers/conference/conference-create.procedure"
import { getConferenceProcedure } from "@/server/api/routers/conference/conference-get.procedure"
import { getConferencesProcedure } from "@/server/api/routers/conference/conference-list.procedure"
import { updateConferenceProcedure } from "@/server/api/routers/conference/conference-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const conferenceRouter = createTRPCRouter({
  get: getConferenceProcedure,
  list: getConferencesProcedure,
  create: createConferenceProcedure,
  update: updateConferenceProcedure,
  archive: archiveConferenceProcedure,
})
