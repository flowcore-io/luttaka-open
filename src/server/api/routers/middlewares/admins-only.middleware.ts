import { experimental_standaloneMiddleware } from "@trpc/server"

import { UserRole } from "@/contracts/user/user-role"
import type { SessionContext } from "@/server/api/trpc"

/**
 * A TRPC Middleware to only allow the logged-in user to proceed if they have an admin role
 * @example
 protectedProcedure.use(adminsOnlyMiddleware)
 */
export const adminsOnlyMiddleware = experimental_standaloneMiddleware<{
  ctx: SessionContext
}>().create(({ ctx, next }) => {
  const user = ctx.user
  if (!user) {
    throw new Error("User not found")
  }

  const role = user.role as UserRole
  if (role !== UserRole.admin) {
    throw new Error("User does not have permission to perform this action")
  }

  return next()
})
