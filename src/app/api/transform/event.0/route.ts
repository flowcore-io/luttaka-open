import eventArchived from "@/app/api/transform/event.0/route-event-archived"
import eventCreated from "@/app/api/transform/event.0/route-event-created"
import eventUpdated from "@/app/api/transform/event.0/route-event-updated"
import { event } from "@/contracts/events/event"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(event, {
  created: eventCreated,
  updated: eventUpdated,
  archived: eventArchived,
})

export const POST = eventTransformer.post.bind(eventTransformer)
