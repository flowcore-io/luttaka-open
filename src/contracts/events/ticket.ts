import { EventDto } from "@/contracts/common"
import { z } from "zod"

export const ticket = {
  flowType: "ticket.0",
  eventType: {
    created: "ticket.created.0",
    updated: "ticket.updated.0",
    archived: "ticket.archived.0",
  },
} as const

export const TicketEventDto = EventDto.merge(
  z.object({
    eventType: z.enum([
      ticket.eventType.created,
      ticket.eventType.updated,
      ticket.eventType.archived,
    ]),
  }),
)

export const TicketEventCreatedPayloadDto = z.object({
  id: z.string(),
  conferenceId: z.string(),
  userId: z.string(),
  state: z.string(),
})

export const TicketEventUpdatedPayloadDto = z.object({
  id: z.string(),
  conferenceId: z.string().optional(),
  userId: z.string().optional(),
  state: z.string().optional(),
})

export const TicketEventArchivedPayloadDto = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})
