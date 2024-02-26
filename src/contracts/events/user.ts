import {z} from "zod";
import {UserRole} from "@/contracts/user/user-role";

export const userEvent = {
  flowType: "user.0",
  eventType: {
    created: "user.created.0",
    updated: "user.updated.0",
    archived: "user.archived.0",
  },
} as const

export const UserCreatedEventPayload = z.object({
  userId: z.string(),
  role: z.nativeEnum(UserRole),
  externalId: z.string(),
});

export const UserDeletedExternallyEventPayload = z.object({
  id: z.string(),
  deleted: z.boolean()
});

export const UserUpdatedEventPayload = z.object({
  userId: z.string(),
  role: z.nativeEnum(UserRole)
});

export const UserArchivedEventPayload = z.object({
  userId: z.string(),
  reason: z.string().optional(),
});
