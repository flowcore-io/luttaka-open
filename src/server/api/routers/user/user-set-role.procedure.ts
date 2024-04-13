import { eq } from "drizzle-orm"
import type { z } from "zod"

import { SetUserRoleInput } from "@/contracts/authorization/set-user-role-input"
import {
  userEvent,
  type UserUpdatedEventPayload,
} from "@/contracts/events/user"
import type { UserRole } from "@/contracts/user/user-role"
import { db } from "@/database"
import { users } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { sendWebhook } from "@/lib/webhook"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

export const setUserRoleProcedure = protectedProcedure
  .input(SetUserRoleInput)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.userId),
    })
    if (!user) {
      throw new Error(`User not found`)
    }

    await sendWebhook<z.infer<typeof UserUpdatedEventPayload>>(
      userEvent.flowType,
      userEvent.eventType.updated,
      {
        userId: user.id,
        role: input.role,
      },
    )

    await waitForPredicate(
      () => db.query.users.findFirst({ where: eq(users.id, input.userId) }),
      (user) => ((user?.role as UserRole) ?? "user") === input.role,
    )
  })
