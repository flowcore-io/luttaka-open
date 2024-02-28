import { eq } from "drizzle-orm"

import { db } from "@/database"
import { users } from "@/database/schemas"

export const getUserByExternalId = async (externalId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.externalId, externalId),
  })
  if (!user) {
    throw new Error(`User not found`)
  }
  return user
}
