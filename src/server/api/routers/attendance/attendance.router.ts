import { attendanceMyConferencesProcedure } from "@/server/api/routers/attendance/attendance-my-conferences.procedure"
import { attendancePageProcedure } from "@/server/api/routers/attendance/attendance-page.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const attendanceRouter = createTRPCRouter({
  page: attendancePageProcedure,
  myConferences: attendanceMyConferencesProcedure,
})
