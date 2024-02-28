import { TicketEventUpdatedPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import { eq } from "drizzle-orm"

export default async function ticketUpdated(payload: unknown) {
  const parsedPayload = TicketEventUpdatedPayload.parse(payload)
  const exists = await db.query.tickets.findFirst({
    where: eq(tickets.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }
  await db
    .update(tickets)
    .set(parsedPayload)
    .where(eq(tickets.id, parsedPayload.id))
}
