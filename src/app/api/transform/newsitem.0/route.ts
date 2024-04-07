import newsitemArchived from "@/app/api/transform/newsitem.0/route-newsitem-archived"
import newsitemCreaed from "@/app/api/transform/newsitem.0/route-newsitem-created"
import newsitemUpdated from "@/app/api/transform/newsitem.0/route-newsitem-updated"
import { newsitem } from "@/contracts/events/newsitem"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(newsitem, {
  created: newsitemCreaed,
  updated: newsitemUpdated,
  archived: newsitemArchived,
})

export const POST = eventTransformer.post.bind(eventTransformer)
