import {ticketRouter} from "@/server/api/routers/ticket"
import {createTRPCRouter} from "@/server/api/trpc"
import {userRouter} from "@/server/api/routers/user"
import {authorizationRouter} from "./routers/authorization"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  ticket: ticketRouter,
  authorization: authorizationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
