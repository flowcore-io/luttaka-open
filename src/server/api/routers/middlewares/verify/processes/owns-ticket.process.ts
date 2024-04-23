import { and, eq } from "drizzle-orm"

import { db } from "@/database"
import { tickets } from "@/database/schemas"
import type { SessionContext } from "@/server/api/trpc"

export type VerifyTicketOwnership = {
  eventId: string
  ticketId: string
}

export const ownsTicketProcess = async (
  ctx: SessionContext,
  input: VerifyTicketOwnership,
) => {
  if (!ctx.user?.id) {
    return false
  }
  const ticket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.id, input.ticketId),
      eq(tickets.userId, ctx.user.id),
      eq(tickets.eventId, input.eventId),
    ),
  })

  return ticket !== undefined
}
