import {UserCreatedExternallyEventPayload, UserDeletedExternallyEventPayload} from "@/contracts/events/user";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";
import shortUUID from "short-uuid";
import {UserRole} from "@/contracts/user/user-role";

const EXTERNAL_ARCHIVE_MESSAGE = "User deleted externally";

export const createUserFromClerkCreationEvent = async (payload: unknown) => {
  const createData = UserCreatedExternallyEventPayload.parse(payload);

  const existingUser = await db.query.users.findFirst({where: eq(users.externalId, createData.id)});
  if (existingUser) {
    console.warn(`User ${existingUser.id} is already linked with external id ${createData.id}`);
    return;
  }

  const userId = shortUUID().generate();
  const result = await db.insert(users).values({
    id: userId,
    externalId: createData.id,
    role: UserRole.user
  });

  if (result.rowCount > 0) {
    console.log(`User created with id "${userId}", and linked with external id "${createData.id}"`);
  }
}

export const archiveUserFromClerkDeletionEvent = async (payload: unknown) => {
  const data = UserDeletedExternallyEventPayload.parse(payload);

  const existingUser = await db.query.users.findFirst({where: eq(users.externalId, data.id)});
  if (!existingUser) {
    console.warn(`User is presumably already archived or not found for external user ${data.id}`);
    return;
  }

  const result = await db.update(users).set({
    externalId: null,
    archived: true,
    reason: EXTERNAL_ARCHIVE_MESSAGE
  }).where(eq(users.externalId, data.id));

  if (result.rowCount > 0) {
    console.log(`User ${existingUser.id}, is archived`);
  }
}
