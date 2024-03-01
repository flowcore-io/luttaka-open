import conferenceArchived from "@/app/api/transform/conference.0/route-conference-archived"
import conferenceCreated from "@/app/api/transform/conference.0/route-conference-created"
import conferenceUpdated from "@/app/api/transform/conference.0/route-conference-updated"
import { conference } from "@/contracts/events/conference"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(conference, {
  created: conferenceCreated,
  updated: conferenceUpdated,
  archived: conferenceArchived,
})

export const POST = eventTransformer.post.bind(eventTransformer)
