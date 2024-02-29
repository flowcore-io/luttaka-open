import { desc, eq } from "drizzle-orm"

import { type ConferencePreview } from "@/contracts/conference/conference"
import { db } from "@/database"
import { conferences, tickets } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

export const attendanceMyConferencesProcedure = protectedProcedure.query(
  async ({ ctx }): Promise<ConferencePreview[]> => {
    const userId = ctx.user.id

    const conferencesUserIsAttending = await db
      .selectDistinct({ conference: conferences })
      .from(conferences)
      .leftJoin(tickets, eq(conferences.id, tickets.conferenceId))
      .where(eq(tickets.userId, userId))
      .orderBy(desc(conferences.startDate))

    return conferencesUserIsAttending.map(({ conference }) => ({
      id: conference.id,
      name: conference.name,
    }))
  },
)
