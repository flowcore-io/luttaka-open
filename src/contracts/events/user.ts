import { z } from "zod"

import { UserRole } from "@/contracts/user/user-role"

export const userEvent = {
  flowType: "user.0",
  eventType: {
    created: "user.created.0",
    updated: "user.updated.0",
    archived: "user.archived.0",
    updatedProfile: "user.profile-updated.0",
  },
} as const

export const UpdateUserProfileEventPayload = z.object({
  userId: z.string(),

  // profile details
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  socials: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().optional(),
})

export const UserCreatedEventPayload = UpdateUserProfileEventPayload.extend({
  externalId: z.string(),
  role: z.nativeEnum(UserRole).optional(),
})

export const UserUpdatedEventPayload = z.object({
  userId: z.string(),
  role: z.nativeEnum(UserRole).optional(),
})

export const UserArchivedEventPayload = z.object({
  userId: z.string(),
  reason: z.string().optional(),
})
