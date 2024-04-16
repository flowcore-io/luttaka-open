import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { sendUserUpdatedEvent } from "@/contracts/events/user"
import { UserRole } from "@/contracts/user/user-role"
import { db } from "@/database"
import { users } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

const AddAdminInputDto = z.object({
  userId: z.string(),
})
export const addProfileAdminProcedure = protectedProcedure
  .input(AddAdminInputDto)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ input }) => {
    await sendUserUpdatedEvent({ userId: input.userId, role: UserRole.admin })
    try {
      await waitForPredicate(
        () =>
          db.query.users.findFirst({
            where: and(
              eq(users.id, input.userId),
              eq(users.role, UserRole.admin),
            ),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
