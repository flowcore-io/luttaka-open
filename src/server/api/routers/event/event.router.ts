import { archiveEventProcedure } from "@/server/api/routers/event/event-archive.procedure"
import { createEventProcedure } from "@/server/api/routers/event/event-create.procedure"
import { getEventProcedure } from "@/server/api/routers/event/event-get.procedure"
import { getEventsProcedure } from "@/server/api/routers/event/event-list.procedure"
import { updateEventProcedure } from "@/server/api/routers/event/event-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

import { getEventPublicProcedure } from "./event-get-public.procedure"
import { getEventPublicListProcedure } from "./event-get-public-list.procedure"

export const eventRouter = createTRPCRouter({
  get: getEventProcedure,
  getPublic: getEventPublicProcedure,
  getPublicList: getEventPublicListProcedure,
  list: getEventsProcedure,
  create: createEventProcedure,
  update: updateEventProcedure,
  archive: archiveEventProcedure,
})
