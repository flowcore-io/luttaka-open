import { archiveConferenceRouter } from "@/server/api/routers/conference/conference-archive"
import { createConferenceRouter } from "@/server/api/routers/conference/conference-create"
import { getConferencesRouter } from "@/server/api/routers/conference/conference-list"
import { updateConferenceRouter } from "@/server/api/routers/conference/conference-update"
import { createTRPCRouter } from "@/server/api/trpc"

export const conferenceRouter = createTRPCRouter({
  list: getConferencesRouter,
  create: createConferenceRouter,
  update: updateConferenceRouter,
  archive: archiveConferenceRouter,
})
