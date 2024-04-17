import { experimental_standaloneMiddleware } from "@trpc/server"

import { UserRole } from "@/contracts/user/user-role"
import { ownsTicketProcess } from "@/server/api/routers/middlewares/verify/processes/owns-ticket.process"
import type { SessionContext } from "@/server/api/trpc"

export type ProcessingMethod<T> = (
  ctx: SessionContext,
  input: T,
) => Promise<boolean>

/**
 * Creates a middleware that checks if the user has the necessary permissions, by using an external processing methods.
 *
 * If a user is an 'admin', then the process is by-passed.
 * Otherwise, a provided processing method is called.
 * - If the method returns "true", then proceed with the request
 * - If the method returns "false", then throw an Unauthorized error

 * Generics:
 * - `T`: The type of the input data that needs to be verified for ownership.
 *
 * @param verifyMethod - A function to check for a conditional.
 * @returns A standalone middleware that can be used in a `tRPC` router to protect sensitive routes.
 */
export const verifyProcessesMiddleware = <T>(
  verifyMethod: ProcessingMethod<T>,
) =>
  experimental_standaloneMiddleware<{
    ctx: SessionContext
  }>().create(async ({ ctx, next, input }) => {
    if (ctx.user?.role === UserRole.admin) {
      return next()
    }

    const result = await verifyMethod(ctx, input as T)
    if (!result) {
      throw new Error("Unauthorized")
    }

    return next()
  })

export const verifyThat = {
  userOwnsTicket: verifyProcessesMiddleware(ownsTicketProcess),
}
