import { asc, eq } from "drizzle-orm"
import { z } from "zod"

import { UserRole } from "@/contracts/user/user-role"
import { db } from "@/database"
import { profiles, ticketOwnershipHistory } from "@/database/schemas"
import { protectedProcedure } from "@/server/api/trpc"

const TicketHistoryInput = z.object({
  ticketId: z.string(),
  userId: z.string().optional(),
})

export const ticketHistoryProcedure = protectedProcedure
  .input(TicketHistoryInput)
  .query(async ({ ctx, input }) => {
    // todo: create a middleware for this validation (but make it more generic)
    if (ctx.user?.role !== UserRole.admin && input.userId) {
      throw new Error(
        "Only administrators are allowed to query ticket history for specific users",
      )
    }

    let history = await db
      .select({
        id: ticketOwnershipHistory.id,
        timestamp: ticketOwnershipHistory.timestamp,
        userId: ticketOwnershipHistory.userId,
        owner: profiles.emails,
      })
      .from(ticketOwnershipHistory)
      .where(eq(ticketOwnershipHistory.ticketId, input.ticketId))
      .orderBy(asc(ticketOwnershipHistory.timestamp))
      .leftJoin(profiles, eq(profiles.userId, ticketOwnershipHistory.userId))

    // admins see the entire history
    if (ctx.user?.role === UserRole.admin) {
      return history.reverse()
    }

    const userId = input.userId ?? ctx.user?.id
    if (!userId) {
      throw new Error("User not specified")
    }

    // users only see the history from when they received the ticket iniitally
    const firstOccurrence = history.findIndex((h) => h.userId === userId)
    history = history.slice(firstOccurrence)
    return history.reverse()
  })
