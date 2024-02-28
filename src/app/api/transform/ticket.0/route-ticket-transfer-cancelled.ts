import { TicketEventTransferCancelledPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketTransfers } from "@/database/schemas"
import { eq } from "drizzle-orm"

export default async function ticketTransferCancelled(payload: unknown) {
  const parsedPayload = TicketEventTransferCancelledPayload.parse(payload)
  await db
    .delete(ticketTransfers)
    .where(eq(ticketTransfers.id, parsedPayload.transferId))
}
