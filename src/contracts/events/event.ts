import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const event = {
  flowType: "event.0",
  eventType: {
    created: "event.created.0",
    updated: "event.updated.0",
    archived: "event.archived.0",
  },
} as const

export const EventEventCreatedPayload = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageBase64: z.string(),
  description: z.string(),
  ticketDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

export const EventEventUpdatedPayload = EventEventCreatedPayload.pick({
  id: true,
  name: true,
  slug: true,
  imageBase64: true,
  description: true,
  ticketDescription: true,
  startDate: true,
  endDate: true,
})
  .partial()
  .required({
    id: true,
  })

export const EventEventArchivedPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const sendEventCreatedEvent = webhookFactory<
  z.infer<typeof EventEventCreatedPayload>
>(event.flowType, event.eventType.created)

export const sendEventUpdatedEvent = webhookFactory<
  z.infer<typeof EventEventUpdatedPayload>
>(event.flowType, event.eventType.updated)

export const sendEventArchivedEvent = webhookFactory<
  z.infer<typeof EventEventArchivedPayload>
>(event.flowType, event.eventType.archived)
