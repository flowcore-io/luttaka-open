import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const userActivity = {
  flowType: "user-activity.0",
  eventType: {
    added: "user-activity.added.0",
    removed: "user-activity.removed.0",
  },
} as const

export const UserActivityAddedEventPayload = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  activityId: z.string(),
})

export const UserActivityRemovedEventPayload = UserActivityAddedEventPayload.pick({
  id: true,
})

export const sendUserActivityAddedEvent = webhookFactory<
  z.infer<typeof UserActivityAddedEventPayload>
>(userActivity.flowType, userActivity.eventType.added)

export const sendUserActivityRemovedEvent = webhookFactory<
  z.infer<typeof UserActivityRemovedEventPayload>
>(userActivity.flowType, userActivity.eventType.removed)
