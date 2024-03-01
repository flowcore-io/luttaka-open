import { companyRouter } from "@/server/api/routers/company/company.router"
import { conferenceRouter } from "@/server/api/routers/conference/conference.router"
import { profileRouter } from "@/server/api/routers/profile"
import ticketRouter from "@/server/api/routers/ticket/ticket.router"
import { userRouter } from "@/server/api/routers/user"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  conference: conferenceRouter,
  user: userRouter,
  profile: profileRouter,
  ticket: ticketRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
