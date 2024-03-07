import { count } from "drizzle-orm"

import { db } from "@/database"
import { profiles } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const getProfileMeProcedure = protectedProcedure.query(
  async (): Promise<number> => {
    return db
      .select({ value: count() })
      .from(profiles)
      .then((result) => result[0]?.value ?? 0)
  },
)
