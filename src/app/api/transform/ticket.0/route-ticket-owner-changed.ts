import { desc, eq } from "drizzle-orm"
import shortUUID from "short-uuid"

import { type EventMetdata } from "@/contracts/common"
import { TicketEventOwnershipChanged } from "@/contracts/events/ticket"
import { db } from "@/database"
import { ticketOwnershipHistory } from "@/database/schemas"

// todo: update all the methods with a metadata parameter
export default async function ticketOwnerChanged(
  payload: unknown,
  metadata?: EventMetdata,
) {
  const parsedPayload = TicketEventOwnershipChanged.parse(payload)

  // we are only interested in the events where the user is changing
  if (!parsedPayload.userId) {
    return
  }

  // just to make sure we are not inserting the same owner twice
  if (
    await isTheLastOwnerTheSameAsTheIncomingOwner(
      parsedPayload.id,
      parsedPayload.userId,
    )
  ) {
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

async function isTheLastOwnerTheSameAsTheIncomingOwner(
  ticket: string,
  incomingUserId: string,
) {
  const lastOwnerOfTicket = await db.query.ticketOwnershipHistory.findFirst({
    where: eq(ticketOwnershipHistory.ticketId, ticket),
    orderBy: desc(ticketOwnershipHistory.timestamp),
  })

  return lastOwnerOfTicket && lastOwnerOfTicket.userId === incomingUserId
}
