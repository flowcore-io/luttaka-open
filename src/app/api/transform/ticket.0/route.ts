import {
  ticket,
  TicketEventArchivedPayload,
  TicketEventCreatedPayload,
  TicketEventTransferAcceptedPayload,
  TicketEventTransferCancelledPayload,
  TicketEventTransferCreatedPayload,
  TicketEventUpdatedPayload,
} from "@/contracts/events/ticket"
import EventTransformer from "@/lib/event-transformer"
import { eq } from "drizzle-orm"
import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"

const eventTransformer = new EventTransformer(ticket, {
  created: async (payload: unknown) => {
    console.log("Got created event", payload)
    const parsedPayload = TicketEventCreatedPayload.parse(payload)
    const exists = await db.query.tickets.findFirst({
      where: eq(tickets.id, parsedPayload.id),
    })
    if (exists) {
      return
    }
    await db.insert(tickets).values(parsedPayload)
  },
  updated: async (payload: unknown) => {
    console.log("Got updated event", payload)
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
  },
  archived: async (payload: unknown) => {
    console.log("Got archived event", payload)
    const parsedPayload = TicketEventArchivedPayload.parse(payload)
    const exists = await db.query.tickets.findFirst({
      where: eq(tickets.id, parsedPayload.id),
    })
    if (!exists) {
      return
    }
    await db.delete(tickets).where(eq(tickets.id, parsedPayload.id))
  },
  transferCreated: async (payload: unknown) => {
    console.log("Got transfer created event", payload)
    const parsedPayload = TicketEventTransferCreatedPayload.parse(payload)
    await db.insert(ticketTransfers).values(parsedPayload)
  },
  transferAccepted: async (payload: unknown) => {
    console.log("Got transfer accepted event", payload)
    const parsedPayload = TicketEventTransferAcceptedPayload.parse(payload)
    await db
      .update(ticketTransfers)
      .set({ state: "accepted" })
      .where(eq(ticketTransfers.id, parsedPayload.transferId))
  },
  transferCancelled: async (payload: unknown) => {
    console.log("Got transfer cancelled event", payload)
    const parsedPayload = TicketEventTransferCancelledPayload.parse(payload)
    await db
      .delete(ticketTransfers)
      .where(eq(ticketTransfers.id, parsedPayload.transferId))
  },
})

export const POST = eventTransformer.post.bind(eventTransformer)
