import { eq } from "drizzle-orm"
import shortUUID from "short-uuid"
import { type z } from "zod"

import { UserCreatedEventPayload } from "@/contracts/events/user"
import { db } from "@/database"
import { profiles, users } from "@/database/schemas"

export const routeUserCreated = async (payload: unknown) => {
  const data = UserCreatedEventPayload.parse(payload)

  const createdUser = await createUser(data)
  if (!createdUser) {
    return
  }

  await createProfile(data)
}

const createUser = async (data: z.infer<typeof UserCreatedEventPayload>) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.externalId, data.externalId),
  })

  if (existingUser) {
    console.error(
      `User ${existingUser.id} is already created with external id "${data.externalId}"`,
    )
    return false
  }

  const userResults = await db.insert(users).values({
    id: data.userId,
    externalId: data.externalId,
    role: data.role,
  })

  if (userResults.rowCount < 1) {
    console.error(
      `User ${data.userId} was not created with external id "${data.externalId}" and role "${data.role}"`,
    )
    return false
  }

  console.log(`Created user ${data.userId}`)
  return true
}

const createProfile = async (data: z.infer<typeof UserCreatedEventPayload>) => {
  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, data.userId),
  })

  if (existingProfile) {
    console.error(
      `Profile ${existingProfile.id} is already created with user id "${data.userId}"`,
    )
    return false
  }

  const profileResults = await db.insert(profiles).values({
    id: shortUUID.generate(),
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    description: data.description,
    socials: data.socials,
    emails: data.emails,
    company: data.company,
    avatarUrl: data.avatarUrl,
  })

  if (profileResults.rowCount < 1) {
    console.error(
      `Profile ${data.userId} was not created with external id "${data.externalId}" and role "${data.role}"`,
    )
    return false
  }

  console.log(`Created profile ${data.userId}`)
  return true
}
