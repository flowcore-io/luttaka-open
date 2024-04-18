import { EventMetdata } from "@/contracts/common"
import { TicketEventOwnershipChanged } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketOwnershipHistory } from "@/database/schemas"
import { eq } from "drizzle-orm"
import shortUUID from "short-uuid"

// todo: update all the methods with a metadata parameter
export default async function ticketOwnerChanged(
  payload: unknown,
  metadata?: EventMetdata,
) {
  const parsedPayload = TicketEventOwnershipChanged.parse(payload)

  if (!parsedPayload.userId) {
    return
  }

  const lastChangeEntry = await db.query.ticketOwnershipHistory.findFirst({
    where: eq(ticketOwnershipHistory.ticketId, parsedPayload.id),
  })

  if (lastChangeEntry && lastChangeEntry.userId === parsedPayload.userId) {
    return
  }

  await db
    .insert(ticketOwnershipHistory)
    .values({
      id: shortUUID.generate(),
      ticketId: parsedPayload.id,
      userId: parsedPayload.userId,
      timestamp: new Date(metadata!.validTime).getTime(),
    })
    .execute()
}
