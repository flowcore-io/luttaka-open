import EventTransformer from "@/lib/event-transformer"
import {UserChangedExternallyEventPayload, userEvent} from "@/contracts/events/user";
import {
  archiveUserFromClerkDeletionEvent,
  createUserFromClerkCreationEvent
} from "@/app/api/transform/user.0/external-user-changes-event-actions";
import {updateUserEventAction} from "@/app/api/transform/user.0/update-user-event-action";
import {archiveUserEventAction} from "@/app/api/transform/user.0/archive-user-event-action";

const CLERK_CREATE_EVENT = "user.created";
const CLERK_DELETE_EVENT = "user.deleted";

const eventTransformer = new EventTransformer(userEvent, {
  externalChanges: async (payload: unknown) => {
    const event = UserChangedExternallyEventPayload.parse(payload);
    switch (event.type) {
      case CLERK_CREATE_EVENT:
        await createUserFromClerkCreationEvent(event.data);
        break;
      case CLERK_DELETE_EVENT:
        await archiveUserFromClerkDeletionEvent(event.data);
        break;
    }
  },
  updated: async (payload: unknown) => updateUserEventAction(payload),
  archived: async (payload: unknown) => archiveUserEventAction(payload),
})


export const POST = eventTransformer.post.bind(eventTransformer)
