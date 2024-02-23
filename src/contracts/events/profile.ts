import {z} from "zod";

export const profileEvent = {
  flowType: "profile.0",
  eventType: {
    created: "profile.created.0",
    updated: "profile.updated.0",
    archived: "profile.archived.0",
  },
} as const


export const ProfileUpdatedEventPayload = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  socials: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().optional()
});


export const ProfileCreatedEventPayload = ProfileUpdatedEventPayload.extend({
  userId: z.string(),
});

export const ProfileArchivedEventPayload = z.object({
  id: z.string(),
  reason: z.string().optional(),
});
