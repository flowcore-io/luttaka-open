import {UserArchivedEventPayload} from "@/contracts/events/user";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";

export const archiveUserEventAction = async (payload: unknown) => {
  const data = UserArchivedEventPayload.parse(payload);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, data.userId)
  });

  if (!existingUser) {
    console.error(`Unable to archive user ${data.userId}. Because user was not found!`);
    return;
  }

  const result = await db.update(users).set({
    archived: true,
    externalId: null
  });

  if (result.rowCount > 0) {
    console.log(`User ${data.userId} archived`);
  }
}
