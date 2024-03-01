import { eq } from "drizzle-orm"
import { type z } from "zod"

import { SetUserRoleInput } from "@/contracts/authorization/set-user-role-input"
import {
  userEvent,
  type UserUpdatedEventPayload,
} from "@/contracts/events/user"
import { type UserRole } from "@/contracts/user/user-role"
import { db } from "@/database"
import { users } from "@/database/schemas"
import { sendWebhook } from "@/lib/webhook"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { getUserById } from "@/server/api/services/user/get-user-by-id"
import { protectedProcedure } from "@/server/api/trpc"
import { waitFor } from "@/server/lib/delay/wait-for"

export const setUserRoleRouter = protectedProcedure
  .input(SetUserRoleInput)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ input }) => {
    const user = await getUserById(input.userId)

    await sendWebhook<z.infer<typeof UserUpdatedEventPayload>>(
      userEvent.flowType,
      userEvent.eventType.updated,
      {
        userId: user.id,
        role: input.role,
      },
    )

    const result = await waitFor(
      () => db.query.users.findFirst({ where: eq(users.id, input.userId) }),
      (user) => ((user?.role as UserRole) ?? "user") === input.role,
    )

    if (!result) {
      throw new Error("Failed to update user role")
    }
  })
