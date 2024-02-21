import {type MiddlewareInput} from "@/server/api/routers/middlewares/types/middleware-input";

/**
 * A TRPC Middleware to verify that the logged-in user has a user id.
 * @example
 protectedProcedure.use(adminsOnlyMiddleware)
 */
export const verifyUserIdMiddleware = async <T>
({
   ctx,
   next
 }: MiddlewareInput<T>): Promise<T> => {

  const userId = ctx.auth?.userId;
  if (!userId) {
    throw new Error("User not found");
  }

  return next();
}