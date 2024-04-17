import { attendanceMyEventsProcedure } from "@/server/api/routers/attendance/attendance-my-events.procedure"
import { attendancePageProcedure } from "@/server/api/routers/attendance/attendance-page.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

import { attendanceCountProcedure } from "./attendance-count.procedure"

export const attendanceRouter = createTRPCRouter({
  page: attendancePageProcedure,
  count: attendanceCountProcedure,
  myEvents: attendanceMyEventsProcedure,
})
