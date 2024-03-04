import { archiveConferenceRouter } from "@/server/api/routers/conference/conference-archive.procedure"
import { createConferenceRouter } from "@/server/api/routers/conference/conference-create.procedure"
import { getConferenceRouter } from "@/server/api/routers/conference/conference-get.procedure"
import { getConferencesRouter } from "@/server/api/routers/conference/conference-list.procedure"
import { updateConferenceRouter } from "@/server/api/routers/conference/conference-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const conferenceRouter = createTRPCRouter({
  get: getConferenceRouter,
  list: getConferencesRouter,
  create: createConferenceRouter,
  update: updateConferenceRouter,
  archive: archiveConferenceRouter,
})
