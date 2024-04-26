import { userActivity } from "@/contracts/events/user-activity"
import EventTransformer from "@/lib/event-transformer"

import personalScheduleAdded from "./route-user-activity-added"
import personalScheduleRemoved from "./route-user-activity-removed"

const eventTransformer = new EventTransformer(userActivity, {
  added: personalScheduleAdded,
  removed: personalScheduleRemoved,
})

export const POST = eventTransformer.post.bind(eventTransformer)
