import { archiveConferenceRouter } from "@/server/api/routers/conference/conference-archive"
import { createConferenceRouter } from "@/server/api/routers/conference/conference-create"
import { getConferenceRouter } from "@/server/api/routers/conference/conference-get"
import { getConferencesRouter } from "@/server/api/routers/conference/conference-list"
import { updateConferenceRouter } from "@/server/api/routers/conference/conference-update"
import { createTRPCRouter } from "@/server/api/trpc"

export const conferenceRouter = createTRPCRouter({
  get: getConferenceRouter,
  list: getConferencesRouter,
  create: createConferenceRouter,
  update: updateConferenceRouter,
  archive: archiveConferenceRouter,
})
