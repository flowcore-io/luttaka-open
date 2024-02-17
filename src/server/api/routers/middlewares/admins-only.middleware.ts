import {type MiddlewareInput} from "@/server/api/routers/middlewares/types/middleware-input";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {clerkClient} from "@clerk/nextjs/server";

/**
 * A TRPC Middleware to only allow the logged-in user to proceed if they have an admin role
 * @example
 protectedProcedure.use(adminsOnlyMiddleware)
 */
export const adminsOnlyMiddleware = async <T>
({
   ctx,
   next
 }: MiddlewareInput<T>): Promise<T> => {

  await verifyUserIdMiddleware({ctx, next});

  const user = await clerkClient.users.getUser(ctx.auth!.userId);
  const privateMetadata = user.privateMetadata;

  const role = privateMetadata.role;
  if (role !== "admin") {
    throw new Error("User does not have permission to perform this action");
  }

  return next();
}