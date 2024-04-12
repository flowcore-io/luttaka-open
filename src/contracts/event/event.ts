import { z } from "zod"

// DTOs

export const EventProfileDto = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  ticketDescription: z.string(),
  ticketPrice: z.number().gte(0),
  ticketCurrency: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  stripeId: z.string(),
})

export const EventPreviewDto = EventProfileDto.pick({
  id: true,
  name: true,
})

export const CreateEventInputDto = EventProfileDto.pick({
  name: true,
  slug: true,
  description: true,
  ticketDescription: true,
  ticketPrice: true,
  ticketCurrency: true,
  startDate: true,
  endDate: true,
  stripeId: true,
})

export const UpdateEventInputDto = EventProfileDto.partial()
  .omit({ stripeId: true })
  .required({
    id: true,
  })

// Types
export type EventProfile = z.infer<typeof EventProfileDto>

export type EventPreview = z.infer<typeof EventPreviewDto>

export type CreateEventInput = z.infer<typeof CreateEventInputDto>

export type UpdateEventInput = z.infer<typeof UpdateEventInputDto>
