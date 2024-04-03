import { attendanceMyEventsProcedure } from "@/server/api/routers/attendance/attendance-my-events.procedure"
import { attendancePageProcedure } from "@/server/api/routers/attendance/attendance-page.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const attendanceRouter = createTRPCRouter({
  page: attendancePageProcedure,
  myEvents: attendanceMyEventsProcedure,
})
