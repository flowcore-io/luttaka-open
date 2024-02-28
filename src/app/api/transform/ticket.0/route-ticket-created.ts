import { eq } from "drizzle-orm"

import { TicketEventCreatedPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"

export default async function ticketCreated(payload: unknown) {
  const parsedPayload = TicketEventCreatedPayload.parse(payload)
  const exists = await db.query.tickets.findFirst({
    where: eq(tickets.id, parsedPayload.id),
  })
  if (exists) {
    return
  }
  await db.insert(tickets).values(parsedPayload)
}
