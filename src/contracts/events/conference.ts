import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const conference = {
  flowType: "conference.0",
  eventType: {
    created: "conference.created.0",
    updated: "conference.updated.0",
    archived: "conference.archived.0",
  },
} as const

export const ConferenceEventCreatedPayload = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ticketPrice: z.number(),
  ticketCurrency: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

export const ConferenceEventUpdatedPayload = ConferenceEventCreatedPayload.pick(
  {
    id: true,
    name: true,
    description: true,
    ticketPrice: true,
    ticketCurrency: true,
    startDate: true,
    endDate: true,
  },
)
  .partial()
  .required({
    id: true,
  })

export const ConferenceEventArchivedPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const sendConferenceCreatedEvent = webhookFactory<
  z.infer<typeof ConferenceEventCreatedPayload>
>(conference.flowType, conference.eventType.created)

export const sendConferenceUpdatedEvent = webhookFactory<
  z.infer<typeof ConferenceEventUpdatedPayload>
>(conference.flowType, conference.eventType.updated)

export const sendConferenceArchivedEvent = webhookFactory<
  z.infer<typeof ConferenceEventArchivedPayload>
>(conference.flowType, conference.eventType.archived)
