import { eq } from "drizzle-orm"

import { TicketEventTransferAcceptedPayload } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketTransfers } from "@/database/schemas"

export default async function ticketTransferAccepted(payload: unknown) {
  const parsedPayload = TicketEventTransferAcceptedPayload.parse(payload)
  await db
    .update(ticketTransfers)
    .set({ state: "accepted" })
    .where(eq(ticketTransfers.id, parsedPayload.transferId))
}
