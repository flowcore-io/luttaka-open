import {UserArchivedEventPayload} from "@/contracts/events/user";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {profiles, users} from "@/database/schemas";
import {type z} from "zod";

export const archiveUserEventAction = async (payload: unknown) => {
  const data = UserArchivedEventPayload.parse(payload);

  await Promise.allSettled([
    archiveUser(data),
    archiveProfile(data)
  ]);
}

const archiveUser = async (data: z.infer<typeof UserArchivedEventPayload>) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, data.userId)
  });

  if (!existingUser) {
    console.warn(`User ${data.userId} is already archived`);
    return;
  }

  const result = await db.update(users).set({
    archived: true
  }).where(eq(users.id, data.userId));

  if (result.rowCount < 1) {
    console.error(`Unable to archive user ${data.userId}`);
  }

  console.log(`User ${data.userId} archived`);
}

const archiveProfile = async (data: z.infer<typeof UserArchivedEventPayload>) => {
  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, data.userId)
  });

  if (!existingProfile) {
    console.warn(`Profile for user ${data.userId} is already archived`);
    return false;
  }

  const result = await db.update(profiles).set({
    archived: true
  }).where(eq(profiles.userId, data.userId));

  if (result.rowCount < 1) {
    console.error(`Unable to archive profile for user ${data.userId}`);
  }

  console.log(`Profile for user ${data.userId} archived`);
}
