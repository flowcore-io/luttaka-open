import { protectedProcedure } from "@/server/api/trpc"
import { db } from "@/database"
import { count } from "drizzle-orm"
import { profiles } from "@/database/schemas"

export const profileCountRouter = protectedProcedure.query(
  async (): Promise<number> => {
    // todo: convert this to only fetch the number of profiles associated a relevant conference
    return db
      .select({ value: count() })
      .from(profiles)
      .then((result) => result[0]?.value ?? 0)
  },
)
