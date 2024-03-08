import { z } from "zod"

// DTOs

export const ConferenceProfileDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ticketDescription: z.string(),
  ticketPrice: z.number().gte(0),
  ticketCurrency: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  stripeId: z.string(),
})

export const ConferencePreviewDto = ConferenceProfileDto.pick({
  id: true,
  name: true,
})

export const CreateConferenceInputDto = ConferenceProfileDto.pick({
  name: true,
  description: true,
  ticketDescription: true,
  ticketPrice: true,
  ticketCurrency: true,
  startDate: true,
  endDate: true,
  stripeId: true,
})

export const UpdateConferenceInputDto = ConferenceProfileDto.partial()
  .omit({ stripeId: true })
  .required({
    id: true,
  })

// Types
export type ConferenceProfile = z.infer<typeof ConferenceProfileDto>

export type ConferencePreview = z.infer<typeof ConferencePreviewDto>

export type CreateConferenceInput = z.infer<typeof CreateConferenceInputDto>

export type UpdateConferenceInput = z.infer<typeof UpdateConferenceInputDto>
