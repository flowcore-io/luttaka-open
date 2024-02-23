import {UserCreatedEventPayload} from "@/contracts/events/user";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";

export const createUserEventAction = async (payload: unknown) => {
  const data = UserCreatedEventPayload.parse(payload);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.externalId, data.externalId)
  });

  if (existingUser) {
    console.warn(`User ${existingUser.id} is already created with external id "${data.externalId}"`);

    await db.update(users).set({
      id: data.userId,
      role: data.role
    }).where(eq(users.externalId, data.externalId));
    
    return;
  }

  const result = await db.insert(users).values({
    id: data.userId,
    externalId: data.externalId,
    role: data.role
  });

  if (result.rowCount > 0) {
    console.log(`User ${data.userId} created with external id "${data.externalId}" and role "${data.role}"`);
  }
}
