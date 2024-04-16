import { activity } from "@/contracts/events/activity"
import EventTransformer from "@/lib/event-transformer"

import activityArchived from "./route-activity-archived"
import activityCreaed from "./route-activity-created"
import activityUpdated from "./route-activity-updated"

const eventTransformer = new EventTransformer(activity, {
  created: activityCreaed,
  updated: activityUpdated,
  archived: activityArchived,
})

export const POST = eventTransformer.post.bind(eventTransformer)
