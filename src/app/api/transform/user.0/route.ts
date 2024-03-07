import { routeUserArchived } from "@/app/api/transform/user.0/route-user-archived"
import { routeUserCreated } from "@/app/api/transform/user.0/route-user-created"
import { routeUserUpdated } from "@/app/api/transform/user.0/route-user-updated"
import { routeUserUpdatedProfile } from "@/app/api/transform/user.0/route-user-updated-profile"
import { userEvent } from "@/contracts/events/user"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(userEvent, {
  created: async (payload: unknown) => routeUserCreated(payload),
  updated: async (payload: unknown) => routeUserUpdated(payload),
  archived: async (payload: unknown) => routeUserArchived(payload),
  updatedProfile: async (payload: unknown) => routeUserUpdatedProfile(payload),
})

export const POST = eventTransformer.post.bind(eventTransformer)
