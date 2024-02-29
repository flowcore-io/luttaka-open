import { eq } from "drizzle-orm"

import { TicketEventArchivedPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"

export default async function ticketArchived(payload: unknown) {
  const parsedPayload = TicketEventArchivedPayload.parse(payload)
  const exists = await db.query.tickets.findFirst({
    where: eq(tickets.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }
  await db.delete(tickets).where(eq(tickets.id, parsedPayload.id))
}
