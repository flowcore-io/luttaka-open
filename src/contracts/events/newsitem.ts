import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const newsitem = {
  flowType: "newsitem.0",
  eventType: {
    created: "newsitem.created.0",
    updated: "newsitem.updated.0",
    archived: "newsitem.archived.0",
  },
} as const

export const NewsitemEventCreatedPayload = z.object({
  id: z.string(),
  title: z.string(),
  imageBase64: z.string(),
  introText: z.string(),
  fullText: z.string().nullable(),
  publicVisibility: z.boolean(),
  publishedAt: z.string(),
  archived: z.boolean(),
  reason: z.string().nullable(),
})

export const NewsitemEventUpdatedPayload = NewsitemEventCreatedPayload.pick({
  id: true,
  title: true,
  imageBase64: true,
  introText: true,
  fullText: true,
  publicVisibility: true,
  publishedAt: true,
  archived: true,
  reason: true,
})
  .partial()
  .required({
    id: true,
  })

export const NewsitemEventArchivedPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const sendNewsitemCreatedEvent = webhookFactory<
  z.infer<typeof NewsitemEventCreatedPayload>
>(newsitem.flowType, newsitem.eventType.created)

export const sendNewsitemUpdatedEvent = webhookFactory<
  z.infer<typeof NewsitemEventUpdatedPayload>
>(newsitem.flowType, newsitem.eventType.updated)

export const sendNewsitemArchivedEvent = webhookFactory<
  z.infer<typeof NewsitemEventArchivedPayload>
>(newsitem.flowType, newsitem.eventType.archived)
