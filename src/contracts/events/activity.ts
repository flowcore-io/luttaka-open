import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const activity = {
  flowType: "activity.0",
  eventType: {
    created: "activity.created.0",
    updated: "activity.updated.0",
    archived: "activity.archived.0",
  },
} as const

export const ActivityEventCreatedPayload = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  description: z.string().nullable(),
  stageName: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  publicVisibility: z.boolean(),
  archived: z.boolean(),
  reason: z.string().nullable(),
})

export const ActivityEventUpdatedPayload = ActivityEventCreatedPayload.pick({
  id: true,
  title: true,
  imageUrl: true,
  description: true,
  stageName: true,
  startTime: true,
  endTime: true,
  publicVisibility: true,
  archived: true,
  reason: true,
})
  .partial()
  .required({
    id: true,
  })

export const ActivityEventArchivedPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const sendActivityCreatedEvent = webhookFactory<
  z.infer<typeof ActivityEventCreatedPayload>
>(activity.flowType, activity.eventType.created)

export const sendActivityUpdatedEvent = webhookFactory<
  z.infer<typeof ActivityEventUpdatedPayload>
>(activity.flowType, activity.eventType.updated)

export const sendActivityArchivedEvent = webhookFactory<
  z.infer<typeof ActivityEventArchivedPayload>
>(activity.flowType, activity.eventType.archived)
