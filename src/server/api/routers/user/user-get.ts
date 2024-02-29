import { protectedProcedure } from "@/server/api/trpc"
import { db } from "@/database"
import { eq } from "drizzle-orm"
import { users } from "@/database/schemas"
import { UserByIdInput } from "@/contracts/user/user-by-id-input"

export const getUserRouter = protectedProcedure
  .input(UserByIdInput)
  .query(({ input }) => {
    return db.query.users.findFirst({ where: eq(users.id, input.userId) })
  })
