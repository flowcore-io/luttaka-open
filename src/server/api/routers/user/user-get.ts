import { eq } from "drizzle-orm"

import { UserByIdInput } from "@/contracts/user/user-by-id-input"
import { db } from "@/database"
import { users } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getUserRouter = protectedProcedure
  .input(UserByIdInput)
  .query(({ input }) => {
    return db.query.users.findFirst({ where: eq(users.id, input.userId) })
  })
