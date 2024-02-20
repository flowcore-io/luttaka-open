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
  id: z.string().uuid(),
  conferenceId: z.string().uuid(),
  userId: z.string(),
  state: z.string(),
})

export const TicketEventUpdatedPayloadDto = TicketEventCreatedPayloadDto.pick({
  id: true,
  userId: true,
  state: true,
})
  .partial()
  .required({ id: true })

export const TicketEventArchivedPayloadDto = TicketEventCreatedPayloadDto.pick({
  id: true,
})
