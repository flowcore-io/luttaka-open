import { attendanceRouter } from "@/server/api/routers/attendance/attendance.router"
import { companyRouter } from "@/server/api/routers/company/company.router"
import { eventRouter } from "@/server/api/routers/event/event.router"
import { profileRouter } from "@/server/api/routers/profile/profile.router"
import ticketRouter from "@/server/api/routers/ticket/ticket.router"
import { userRouter } from "@/server/api/routers/user/user.router"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  event: eventRouter,
  user: userRouter,
  profile: profileRouter,
  ticket: ticketRouter,
  attendance: attendanceRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
