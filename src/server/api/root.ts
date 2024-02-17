import {createTRPCRouter} from "@/server/api/trpc";
import {contactRouter} from "./routers/contact";
import {userRouter} from "@/server/api/routers/user";
import {authorizationRouter} from "@/server/api/routers/authorization";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  contact: contactRouter,
  user: userRouter,
  authorization: authorizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
