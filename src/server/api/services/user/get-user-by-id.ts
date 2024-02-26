import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";

export const getUserById = async (userId: string) => {
  const user = await db.query.users.findFirst({where: eq(users.id, userId)});
  if (!user) {
    throw new Error(`User not found`);
  }
  return user;
}
