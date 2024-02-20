import {
  ticket,
  TicketEventArchivedPayloadDto,
  TicketEventCreatedPayloadDto,
  TicketEventUpdatedPayloadDto,
} from "@/contracts/events/ticket"
import EventTransformer from "@/lib/event-transformer"
import { eq } from "drizzle-orm"
import { db } from "@/database"
import { tickets } from "@/database/schemas"

const eventTransformer = new EventTransformer(ticket, {
  created: async (payload: unknown) => {
    console.log("Got created event", payload)
    const parsedPayload = TicketEventCreatedPayloadDto.parse(payload)
    const exists = await db.query.tickets.findFirst({
      where: eq(tickets.id, parsedPayload.id),
    })
    if (exists) {
      return
    }
    await db.insert(tickets).values(parsedPayload)
  },
  updated: async (payload: unknown) => {
    const parsedPayload = TicketEventUpdatedPayloadDto.parse(payload)
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
    const parsedPayload = TicketEventArchivedPayloadDto.parse(payload)
    const exists = await db.query.tickets.findFirst({
      where: eq(tickets.id, parsedPayload.id),
    })
    if (!exists) {
      return
    }
    await db.delete(tickets).where(eq(tickets.id, parsedPayload.id))
  },
})

export const POST = eventTransformer.post.bind(eventTransformer)
