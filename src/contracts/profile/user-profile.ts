import z from "zod"

export const UserProfileDto = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),

  displayName: z.string().default(""),
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  socials: z.string().default(""),
  company: z.string().default(""),
  avatarUrl: z.string().default(""),
  initials: z.string().default(""),
})

export type UserProfile = z.infer<typeof UserProfileDto>
