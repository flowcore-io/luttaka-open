import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { users } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const UserByIdInput = z.object({
  userId: z.string(),
})

export const getUserProcedure = protectedProcedure
  .input(UserByIdInput)
  .query(({ input }) => {
    return db.query.users.findFirst({ where: eq(users.id, input.userId) })
  })
