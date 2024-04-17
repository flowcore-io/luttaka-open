import { z } from "zod"

// todo: add additional dots and types that are missing

// DTOs

export const TicketDto = z.object({
  id: z.string(),
  eventId: z.string(),
  note: z.string(),
})

export const UpdateTicketInputDto = TicketDto.pick({
  id: true,
  eventId: true,
  note: true,
})
  .partial()
  .required({
    id: true,
    eventId: true,
  })

export const TicketsForEventInputDto = TicketDto.pick({
  eventId: true,
})

// Types
export type Ticket = z.infer<typeof TicketDto>

export type TicketsForEventInput = z.infer<typeof TicketsForEventInputDto>

export type UpdateTicketInput = z.infer<typeof UpdateTicketInputDto>
