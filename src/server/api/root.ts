import { createTRPCRouter } from "@/server/api/trpc";
import { contactRouter } from "./routers/contact";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  contact: contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
