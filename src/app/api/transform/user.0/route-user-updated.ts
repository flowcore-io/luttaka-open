import { eq } from "drizzle-orm"

import { UserUpdatedEventPayload } from "@/contracts/events/user"
import { db } from "@/database"
import { users } from "@/database/schemas"

export const routeUserUpdated = async (payload: unknown) => {
  const data = UserUpdatedEventPayload.parse(payload)

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, data.userId),
  })

  if (!existingUser) {
    console.error(
      `Unable to update user ${data.userId} with role ${data.role}. Because user was not found!`,
    )
    return
  }

  const result = await db
    .update(users)
    .set({
      role: data.role,
    })
    .where(eq(users.id, existingUser.id))

  if (result.rowCount < 1) {
    console.error(`Unable to update user ${data.userId} with role ${data.role}`)
    return
  }

  console.log(`Updated user ${data.userId}`)
  return
}
