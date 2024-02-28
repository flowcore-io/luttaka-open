import { TicketEventTransferCreatedPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketTransfers } from "@/database/schemas"

export default async function ticketTransferCreated(payload: unknown) {
  const parsedPayload = TicketEventTransferCreatedPayload.parse(payload)
  await db.insert(ticketTransfers).values(parsedPayload)
}
