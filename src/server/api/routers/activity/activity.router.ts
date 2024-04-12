import { createTRPCRouter } from "@/server/api/trpc"

import { archiveActivityProcedure } from "./activity-archive.procedure"
import { createActivityProcedure } from "./activity-create.procedure"
import { getActivityProcedure } from "./activity-get.procedure"
import { listActivitiesProcedure } from "./activity-list.procedure"
import { updateActivityProcedure } from "./activity-update.procedure"

export const activityRouter = createTRPCRouter({
  get: getActivityProcedure,
  list: listActivitiesProcedure,
  create: createActivityProcedure,
  update: updateActivityProcedure,
  archive: archiveActivityProcedure,
})
