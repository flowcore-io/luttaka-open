import { z } from "zod"

// DTOs

export const ConferenceProfileDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ticketPrice: z.number().gte(0),
  ticketCurrency: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

// Types
export type ConferenceProfile = z.infer<typeof ConferenceProfileDto>
