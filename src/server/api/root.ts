import {ticketRouter} from "@/server/api/routers/ticket"
import {createTRPCRouter} from "@/server/api/trpc"
import {userRouter} from "@/server/api/routers/user"
import {accountRouter} from "@/server/api/routers/account";
import {profileRouter} from "@/server/api/routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  profile: profileRouter,
  ticket: ticketRouter,
  account: accountRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
