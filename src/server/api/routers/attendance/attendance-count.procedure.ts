import { count, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/database"
import { profiles, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const AttendanceCountInput = z.object({
  eventId: z.string(),
})

export const attendanceCountProcedure = protectedProcedure
  .input(AttendanceCountInput)
  .query(async ({ input }): Promise<number> => {
    return db
      .select({ value: count() })
      .from(profiles)
      .leftJoin(tickets, eq(profiles.userId, tickets.userId))
      .where(eq(tickets.eventId, input.eventId))
      .then((result) => result[0]?.value ?? 0)
  })
