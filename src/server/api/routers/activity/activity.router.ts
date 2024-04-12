import { createTRPCRouter } from "@/server/api/trpc"

import { archiveActivityProcedure } from "./activity-archive.procedure"
import { createActivityProcedure } from "./activity-create.procedure"
import { getActivityProcedure } from "./activity-get.procedure"
import { listActivityProcedure } from "./activity-list.procedure"
import { getActivityPublishedProcedure } from "./activity-list-published.procedure"
import { updateActivityProcedure } from "./activity-update.procedure"

export const activityRouter = createTRPCRouter({
  get: getActivityProcedure,
  getPublished: getActivityPublishedProcedure,
  list: listActivityProcedure,
  listPublished: getActivityPublishedProcedure,
  create: createActivityProcedure,
  update: updateActivityProcedure,
  archive: archiveActivityProcedure,
})
