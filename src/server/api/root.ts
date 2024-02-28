import ticketRouter from "@/server/api/routers/ticket/ticket.router"
import { createTRPCRouter } from "@/server/api/trpc"
import { userRouter } from "@/server/api/routers/user"
import { profileRouter } from "@/server/api/routers/profile"
import { conferenceRouter } from "@/server/api/routers/conferences"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  conference: conferenceRouter,
  user: userRouter,
  profile: profileRouter,
  ticket: ticketRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
