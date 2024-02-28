import { eq } from "drizzle-orm"

import { db } from "@/database"
import { users } from "@/database/schemas"

export const getUserById = async (userId: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) {
    throw new Error(`User not found`)
  }
  return user
}
