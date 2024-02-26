import {UserUpdatedEventPayload} from "@/contracts/events/user";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";

export const updateUserEventAction = async (payload: unknown) => {
  const data = UserUpdatedEventPayload.parse(payload);

  const existingUser = await db.query.users.findFirst(
    {where: eq(users.id, data.userId)}
  );
  
  if (!existingUser) {
    console.error(`Unable to update user ${data.userId} with role ${data.role}. Because user was not found!`);
    return;
  }

  const result = await db.update(users).set({
    role: data.role
  });

  if (result.rowCount > 0) {
    console.log(`User ${data.userId} updated with role ${data.role}`);
  }
}
