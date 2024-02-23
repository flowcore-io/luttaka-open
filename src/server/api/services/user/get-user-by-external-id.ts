import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";

export const getUserByExternalId = async (externalId: string) => {
  const user = await db.query.users.findFirst({where: eq(users.externalId, externalId)});
  if (!user) {
    throw new Error(`User not found`);
  }
  return user;
}
